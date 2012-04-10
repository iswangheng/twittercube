#!/usr/bin/env python
# coding: utf-8
import web

db = web.database(dbn='mysql', db='twitter_cube', user='root', pw='swarm')
 
render = web.template.render('templates')

web.config.debug = True

config = web.storage(
    email='iswangheng@gmail.com',
    site_name = 'Twitter Cube',
    site_desc = '',
    static = '/static',
    CONSUMER_KEY = "Bim7MtyWZjYvYIqImZWw",
    CONSUMER_SECRET = "zwGggVuRJsDoomJWl8GJUGxQcPUi7OUVkbtgOOLpx0w",
    CALLBACK = "/callback",   
)


web.template.Template.globals['config'] = config
web.template.Template.globals['render'] = render
