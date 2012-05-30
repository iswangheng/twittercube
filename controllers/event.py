#!usr/bin/env python
# coding: utf-8
 
import web
import json
import os
import sys
import time
import commands   
from config import settings   


render = settings.render
db = settings.db 
config = settings.config   


#will get the 5 hottest keywords and freqs of the date from the database
def get_keywords(date):
    print "query date: %s" % str(date)
    query_str = "SELECT word, freq FROM keywords WHERE date = '%s' ORDER BY freq DESC LIMIT 5" % str(date)
    result = db.query(query_str)
    keywords_list = []
    for row in result:  
        keywords_dict = {'keyword': row.word}
        keywords_dict.update({'frequency': row.freq})
        keywords_list.append(keywords_dict) 
    return keywords_list
  

#when user come to the event.html, will show
# the 5 hottest keywords and their frequencies of that specific date
#TODO  AND also return the 5 keywords graph data..(which are 5 arrays)

class ShowKeywordsFreqs:
    def POST(self):    
        date = web.input().signal
        print "will show the 5 hottest keywords and frequencies"  
        keywords_list = get_keywords(date)
        data = ({'keywords_list': keywords_list})     
        data_string = json.dumps(data)
        web.header('Content-Type', 'application/json')
        return data_string    
   
