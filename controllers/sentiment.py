#!usr/bin/env python
# coding: utf-8
 
import web
import json
import os
import sys
import time
import commands   
import tweepy 
from config import settings   


render = settings.render
db = settings.db 
config = settings.config   


#For the explore.html, #analyze button
#This function uses the model I have trained already to classify the text
#the model will return best sentiment category of the input text
def get_sentiment(text, test_file_name):
    try:
        savetestFile = open(test_file_name,'w')
        savetestFile.write(text)
        savetestFile.close()
    except IOError, msg:
        print "I/O error: %s" % msg
    cmd = 'java -jar PBasic.jar %s' % test_file_name
    category = commands.getoutput(cmd)     
    #now will delete this temp file
    cmd = 'rm %s' % test_file_name
    commands_result = commands.getoutput(cmd)
    category = category.strip()
    category = category.encode("utf-8")
    return category

#store the sentiment sentence into the database named sentiment_sentences
def store_sentence(text, posneg):
    try:
        db.insert('sentiment_sentences', posneg=str(posneg), sentence=text)
        print "!!!!#####insert db@@@####sentiment_sentences########"
    except:
        print "db insert error"


# used to get the latest 6 sentences people are analyzing from the database
# will return a list named "sentence_list", 
#	each element would contain both "posneg" and "sentence"
def get_sentences():
    try:
        query_str = "SELECT posneg, sentence FROM sentiment_sentences ORDER BY id DESC LIMIT 6"
        result = db.query(query_str)
        sentence_list = []
        for row in result: 
            sentence = row.sentence
            posneg = row.posneg            
            sentence_dict = {'posneg': posneg}
            sentence_dict.update({'sentence': sentence})
            sentence_list.append(sentence_dict) 
    except:
        print "maybe is the DB query error or something else....lol"
    return sentence_list



#when user click the #analyze button, will do the following
#1. use the sentiment model to classify the sentence which is the input text in the textarea,
#    will tell whether this sentence is positive or negative
#2. return the result(positive or negative)
class SentimentAnalysis:
    def POST(self): 
        textarea = web.input().signal  
        print 'textarea=', textarea 
        test_file_name = web.ctx.session.session_id 
        category = get_sentiment(textarea, test_file_name) 
        if category == "neg":
           category = "Negative"
        else:
           category = "Positive"
        print 'category--------> ', category 
        textarea = textarea.encode("utf-8")
        category = category.encode("utf-8")
        store_sentence(textarea, category)
        data = {'category':category}  
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "will now return~~~~~~~~~~~~" 
        return data_string

#when user come to the explore.html, will show
# the latest 6 sentences people are asking and the pos or neg of those sentences
class ShowSentences:
    def POST(self):    
        print "will show the user 6 latest sentences"  
        sentence_list = get_sentences()
        data = ({'sentence_list': sentence_list})     
        data_string = json.dumps(data)
        web.header('Content-Type', 'application/json')
        return data_string    
   
