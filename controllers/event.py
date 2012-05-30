#!usr/bin/env python
# coding: utf-8
 
import web
import json
import os
import sys
import time
import commands   
from config import settings 
from datetime import datetime,timedelta


render = settings.render
db = settings.db 
config = settings.config   


#will get the 5 hottest keywords and freqs of the date from the database
def get_keywords(date_str):
    print "query date: %s" % str(date_str)
    query_str = "SELECT word, freq FROM keywords WHERE date = '%s' ORDER BY freq DESC LIMIT 5" % str(date_str)
    result = db.query(query_str)
    keywords_list = []
    for row in result:  
        keywords_dict = {'keyword': row.word}
        keywords_dict.update({'frequency': row.freq})
        keywords_list.append(keywords_dict) 
    return keywords_list
  

#will get the 5 keywords array from the file written by SimilarTrend.jar
def get_keywords_lines(file_name, date_string):
    print "will get keywords lines"
    cmd = 'java -jar SimilarTrend.jar %s %s' % (file_name, date_string)
    output = commands.getoutput(cmd)    
    openfile = open(file_name,"r")
    count = 0 
    keywords_lines = {}
    max_yaxis = 0
    while True:
        if count == 5:
            break
        content = openfile.readline() 
        content = content[0:-1]
        #print content
        index = content.index(':') + 1 
        content = content[index:]
        content = content.strip()
        freq_list = content.split(" ")
        single_line_element = []
        single_line = []
        distance = 0
        for freq in freq_list:
            single_line_element=[]
            single_line_element.append(date_minus_day(date_string, distance))
            single_line_element.append(freq)
            single_line.append(single_line_element)
            if freq > max_yaxis:
                max_yaxis = freq
            distance += 1
        single_line.reverse()     
        count += 1
        print "single_line_list: ", single_line  
        if count == 1:
            keywords_lines = {"line1": single_line}
        else:
            key_str = "line%s" % str(count)
            keywords_lines.update({key_str: single_line})
    max_yaxis = int(float(max_yaxis) * 1.1)
    keywords_lines.update({"max_yaxis": max_yaxis})
    openfile.close()
    return keywords_lines


#will return the date where date = date - days
def date_minus_day(date_string, days):
    date_keyword = datetime.strptime(date_string, '%Y-%m-%d')
    #print "date: ", date_keyword
    date_keyword -= timedelta(days)
    print "date after sub: ", datetime.strftime(date_keyword, '%Y-%m-%d')
    return datetime.strftime(date_keyword, '%Y-%m-%d')


#when user come to the event.html, will show
# the 5 hottest keywords and their frequencies of that specific date
#TODO  AND also return the 5 keywords graph data..(which are 5 arrays)
class ShowKeywordsFreqs:
    def POST(self):    
        date_str = web.input().signal
        file_name = web.ctx.session.session_id 
        print "will show the 5 hottest keywords and frequencies"  
        keywords_list = get_keywords(date_str)
        keywords_lines = get_keywords_lines(file_name, date_str)
        data = ({'keywords_list': keywords_list}) 
        data.update({'keywords_lines': keywords_lines})
        data_string = json.dumps(data)
        web.header('Content-Type', 'application/json')
        return data_string    
   
