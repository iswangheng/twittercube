#!usr/bin/env python
# coding: utf-8
 
import web
import json
import os
import commands
import twitter  
import tweepy 
from config import settings 

render = settings.render
db = settings.db 
config = settings.config 
  

def get_category(text):
    savetestFile = open('testFile','w')
    savetestFile.write(text)
    savetestFile.close()
    cmd = 'java -jar classifyText.jar ' + 'testFile'
    category = commands.getoutput(cmd)     
    index = category.index(':') + 1
    category = category[index:]
    return category


class Index:
    def GET(self):
        return render.index()

    def POST(self): 
        print 'post index'
        return

class ShowExperts:
    def POST(self): 
        textarea = web.input().signal  
        print 'textarea=', textarea 	
        category = get_category(textarea)
        experts = '@one' + ' ' + '@two' + ' ' + '@three' + ' '
        data = {'category':category}
        data.update({'experts':experts})
        data_string = json.dumps(data) 
        return data_string


class SubmitTweet:
    def POST(self):
        textarea = web.input().signal  
        print 'textarea=', textarea 
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET) 
        access_token_key = web.ctx.session.access_token_key
        access_token_secret = web.ctx.session.access_token_secret
        auth.set_access_token(access_token_key,access_token_secret)
        api = tweepy.API(auth)
        tweet = 'send from swarms website: '
        tweet = tweet + textarea + '' 
        api.update_status(tweet)             


class Asking:
    def GET(self):
        try:
            return render.asking(web.ctx.session)
        except AttributeError:
            web.seeother('sign_in_with_twitter')


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
            print "auth.access_token.key: ", auth.access_token.key
            print "auth.access_token.secret: ", auth.access_token.secret
            web.ctx.session.access_token_key = auth.access_token.key
            web.ctx.session.access_token_secret = auth.access_token.secret
            api = tweepy.API(auth) 
            web.ctx.session.user = api.me() 
            #api.update_status('tweepy + oauth! aiya maya lei si wole gaole bantian d..')
        except tweepy.TweepError:
            print 'Error! Failed to get access token.' 
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
 



