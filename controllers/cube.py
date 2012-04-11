#!usr/bin/env python
# coding: utf-8
 
import web
import json
import os
import sys
import time
import commands
import twitter  
import tweepy 
from config import settings 

render = settings.render
db = settings.db 
config = settings.config 
  

#This function uses the model I have trained already to classify the text
#the model will return best category of the input text
def get_category(text, test_file_name):
    try:
        savetestFile = open(test_file_name,'w')
        savetestFile.write(text)
        savetestFile.close()
    except IOError, msg:
        print "I/O error: %s" % msg
    cmd = 'java -jar classifyText.jar %s' % test_file_name
    category = commands.getoutput(cmd)     
    #now will delete this temp file
    cmd = 'rm %s' % test_file_name
    commands_result = commands.getoutput(cmd)
    index = category.index(':') + 1
    category = category[index:]
    category = category.strip()
    return category


#used to convert the original category string for better looking
def convert_category(cat):
    cat_dict = {'art&design': 'Art & Design'}
    cat_dict['autos'] = 'Autos'
    cat_dict['business'] = 'Business'
    cat_dict['education'] = 'Education'
    cat_dict['entertainment'] = 'Entertainment'
    cat_dict['fashion'] = 'Fashion'
    cat_dict['food'] = 'Food'
    cat_dict['health'] = 'Health'
    cat_dict['music'] = 'Music'
    cat_dict['politics'] = 'Politicts'
    cat_dict['religion'] = 'Religion'
    cat_dict['sci&tech'] = 'Science & Technology'
    cat_dict['sports'] = 'Sports'
    cat_dict['travel'] = 'Travel' 
    return cat_dict[cat]


#query the database according to the category and get some experts of that area
def get_experts(category):
    query_str = "SELECT username FROM experts ORDER BY " + category + " DESC LIMIT 5"
    result = db.query(query_str)
    experts = []
    for expert in result:
        experts.append(expert.username)
    #print experts[0], " ", experts[1]
    return experts


#just to get the api instance of tweepy
def get_tweepAPI(session):
    auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET) 
    access_token_key = session.access_token_key
    access_token_secret = session.access_token_secret
    auth.set_access_token(access_token_key,access_token_secret)
    api = tweepy.API(auth)
    return api


#to render the index page
class Index:
    def GET(self):
        return render.index()

    def POST(self): 
        print 'post index'
        return

#when user click the show experts button, will do the following
#1. use the model to classify the question which is the input text in the textarea
#2. invoke the get_experts() to get some experts of that area
#3. return the best category the experts' detailed infomation
class ShowExperts:
    def POST(self): 
        textarea = web.input().signal  
        print 'textarea=', textarea 
        test_file_name = web.web.ctx.session.session_id 
        category = get_category(textarea, test_file_name) 
        print 'category--------> ', category
        if category == "art&design":
            db_column_category = "artdesign"
        elif category == "sci&tech":
            db_column_category = "scitech"
        else:
            db_column_category = category          
        experts_list = get_experts(db_column_category)
        experts_detailed_list = []
        try:
            api = get_tweepAPI(web.ctx.session)    
            for expert in experts_list:
                print "expert---> ", expert
                user = api.get_user(screen_name=expert)
                profile_image_url = user.profile_image_url
                description = user.description
                expert_detailed = {"screen_name": expert, "profile_image_url":profile_image_url, "description":description}
                experts_detailed_list.append(expert_detailed)
        except tweepy.TweepError, err_msg:
            experts_detailed_list = []
            print err_msg 
        category = convert_category(category)
        data = {'category':category} 
        data.update({'experts_detailed_list':experts_detailed_list})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "will now return~~~~~~~~~~~~" 
        return data_string


#when user click the ask them button
#1. will update status
#2. will for 2 seconds and get the user's latest tweet,
#   just to check whether the update status action is successful or not
class SubmitTweet:
    def POST(self):
        textarea = web.input().signal  
        api = get_tweepAPI(web.ctx.session) 
        tweet = '' + textarea + '' 
        print 'tweet textarea=', tweet 
        try:
            api.update_status(tweet)    
            time.sleep(2)
        except tweepy.TweepError, err_msg:
            #TODO here to handle the tweepy or api error
            print err_msg
        try:
            user = api.me()
            user_img = user.profile_image_url
            user_name = user.name
            user_screen_name = user.screen_name 
            status_list = api.user_timeline(screen_name = user_screen_name, count=10)
            print 'list 0 text;--------- ', status_list[0].created_at
            tweet_time = str(status_list[0].created_at) 
            tweet_text = status_list[0].text
        except:
            user_img = ""
            user_name = "ERROR"
            user_screen_name = "error"
            tweet_time = ".."
            tweet_text = "The serve has encounted an error"
        data = {'user_img': user_img} 
        data.update({'user_name': user_name}) 
        data.update({'user_screen_name': user_screen_name})
        data.update({'tweet_time': tweet_time})
        data.update({'tweet_text': tweet_text})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        return data_string      


#when user click the view details button of the asking experts in the index page
# will check if he has logged in or not
# then take him to the right page
class Asking:
    def GET(self):
        try:
            print "web.ctx.session.access_token_key: %s" % web.ctx.session.access_token_key
            return render.asking()
        except AttributeError:
            web.seeother('sign_in_with_twitter')


#when use click the sign in with twitter button
class SignIn:
    def GET(self): 
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
        try:
            redirect_url = auth.get_authorization_url()
        except tweepy.TweepError:
            print 'Error! Failed to get request token.' 
        web.ctx.session.request_token_key = auth.request_token.key 
        web.ctx.session.request_token_secret = auth.request_token.secret 
        print 'session_id ------->>: ', web.ctx.session.session_id  
        print redirect_url
        web.seeother(redirect_url) 


#when the twitter signing in action takes the user to the call back page
class Callback:
    def GET(self):
        print 'call back page: '     
        form = web.input() 
        verifier = form.oauth_verifier  
        print 'web.ctx.session.session_id------->.', web.ctx.session.session_id
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)   
        REQUEST_TOKEN_KEY = web.ctx.session.request_token_key
        REQUEST_TOKEN_SECRET = web.ctx.session.request_token_secret
        auth.set_request_token(REQUEST_TOKEN_KEY, REQUEST_TOKEN_SECRET) 
        try:
            auth.get_access_token(verifier)
            print "auth.access_token.key: %s" % auth.access_token.key
            print "auth.access_token.secret: %s" % auth.access_token.secret
            web.ctx.session.access_token_key = auth.access_token.key
            web.ctx.session.access_token_secret = auth.access_token.secret
            api = tweepy.API(auth)   
        except tweepy.TweepError, msg:
            print 'Error: ', msg
        web.seeother('asking.html')  


class Others:
    def GET(self,other): 
        if other == 'about.html':
            return render.about()
        elif other == 'contact.html':
            return render.contact()    
        elif other == 'event.html':
            return render.event()
        elif other == 'explore.html':
            return render.explore()
        elif other == 'index.html':
            return render.index()

    def POST(self):
        print 'post self'
        return
 



