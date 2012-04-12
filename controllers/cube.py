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


#convert the datetime of twitter api to the local time using utc_offset
def get_local_time(datetime):
    #TODO utc_offset needs to be modified according to the visitors timezone!!
    #     change the code below in the future 
    utc_offset = config.utc_offset 
    datetime = str(datetime)
    #TODO remained to be done......
    local_time = datetime  
    return local_time



#this function is to return a dict object of user tweets(5 tweets inside), also including the user info
def get_user_tweets(session):
    user_tweets_list = []
    user_screen_name = session.user_screen_name
    try:  
        api = get_tweepAPI(session) 
        status_list = api.user_timeline(screen_name = user_screen_name, count=5) 
        for status in status_list:
            tweet_dict = {"tweet_time": get_local_time(status.created_at)}
            tweet_dict.update({"tweet_text": status.text})
            tweet_dict.update({"tweet_id": status.id})
            user_tweets_list.append(tweet_dict) 
    except:
        print 'api.user_timeline ERROR......................'  
    user_tweets_list.reverse()
    for user_tweets in user_tweets_list:
        print "time: %s text: %s id: %s" % (user_tweets['tweet_time'], user_tweets['tweet_text'], user_tweets['tweet_id'])
    return user_tweets_list


#this function returns the json data that needs to be sent back to the browser
# the json data is a list containing the 5 latest tweets of current user
def get_tweets_list(session):
    user_screen_name = session.user_screen_name
    user_tweets_list = get_user_tweets(session)
    data = {'user_screen_name': user_screen_name}   
    data.update({'user_tweets_list': user_tweets_list})
    data_string = json.dumps(data)
    return data_string

#store the current user info into the session
# of course we need to use the api to get the current user info
def store_user_into_session(api):
    try:
        user = api.me()
        user_img = user.profile_image_url
        user_name = user.name
        user_screen_name = user.screen_name 
        user_location = user.location 
        user_statuses_count = user.statuses_count
        user_following_count = user.friends_count
        user_followers_count = user.followers_count 
    except:
        user_img = ""
        user_name = "ERROR"
        user_screen_name = 'error'
        user_location = 'Hong Kong'
        user_statuses_count = 123
        user_following_count = 456
        user_followers_count = 789 
    web.ctx.session.user_img = user_img
    web.ctx.session.user_name = user_name
    web.ctx.session.user_screen_name = user_screen_name
    web.ctx.session.user_location = user_location
    web.ctx.session.user_statuses_count = user_statuses_count
    web.ctx.session.user_following_count = user_following_count
    web.ctx.session.user_followers_count = user_followers_count
    print 'web.ctx.session.user_name %s' % web.ctx.session.user_name 


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
        tweet = str(textarea)
        print 'tweet textarea=', tweet 
        try:
            api.update_status(tweet)    
            time.sleep(2)
        except tweepy.TweepError, err_msg:
            #TODO here to handle the tweepy or api error
            print err_msg 
        web.header('Content-Type', 'application/json')
        data_string = get_tweets_list(web.ctx.session)
        return data_string      


#when use click delete
# this tweet should be deleted..
class DeleteTweet:
    def POST(self):
        tweet_id = web.input().signal
        api = get_tweepAPI(web.ctx.session) 
        print 'tweet id= %s', tweet_id 
        try:
            api.destroy_status(tweet_id);
        except tweepy.TweepError, err_msg:
            #TODO here to handle the tweepy or api error
            print err_msg 
        return "okay"



#when user click the view details button of the asking experts in the index page
# will check if he has logged in or not
# then take him to the right page
class Asking:
    def GET(self):
        try:
            print "web.ctx.session.access_token_key: %s" % web.ctx.session.access_token_key
            print "web.ctx.session.access_token_secret: %s" % web.ctx.session.access_token_secret 
            api = get_tweepAPI(web.ctx.session) 
            store_user_into_session(api)    
            return render.asking()
        except AttributeError:
            web.seeother('sign_in_with_twitter')


#when the user has come to the asking.html page
# which means that he has logged in
# so this class is to process the ajax of showing user info
class ShowUserInfo:
    def POST(self):    
        session = web.ctx.session     
        print "will show the user info, session.user_screen_name is : %s" % session.user_screen_name
        data = {'user_img': session.user_img} 
        data.update({'user_name': session.user_name}) 
        data.update({'user_screen_name': session.user_screen_name}) 
        data.update({'user_location': session.user_location}) 
        data.update({'user_statuses_count': session.user_statuses_count}) 
        data.update({'user_following_count': session.user_following_count}) 
        data.update({'user_followers_count': session.user_followers_count}) 
        user_tweets_list = get_user_tweets(web.ctx.session)   
        data.update({'user_tweets_list': user_tweets_list})
        data_string = json.dumps(data)
        web.header('Content-Type', 'application/json')
        return data_string      
 

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
        print "redirect_url: ", redirect_url
        web.seeother(redirect_url) 


#when the twitter signing in action takes the user to the call back page
class Callback:
    def GET(self):
        print 'call back page: '     
        form = web.input() 
        verifier = form.oauth_verifier   
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)   
        print "request_token_key: ", web.ctx.session.request_token_key
        print "request_token_secret: ", web.ctx.session.request_token_secret
        REQUEST_TOKEN_KEY = web.ctx.session.request_token_key
        REQUEST_TOKEN_SECRET = web.ctx.session.request_token_secret
        auth.set_request_token(REQUEST_TOKEN_KEY, REQUEST_TOKEN_SECRET) 
        try:
            auth.get_access_token(verifier)
            web.ctx.session.access_token_key = auth.access_token.key
            web.ctx.session.access_token_secret = auth.access_token.secret
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
 



