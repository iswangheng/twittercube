#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',               pre_fix + 'cube.Index', 
     '/sign_in_with_twitter', pre_fix + 'cube.SignIn',
     '/callback',       pre_fix + 'cube.Callback',
     '/asking.html',    pre_fix + 'cube.Asking',
     '/show_user_info',    pre_fix + 'cube.ShowUserInfo',  
     '/show_user_tweets',  pre_fix + 'cube.ShowUserTweets',
     '/show_experts',   pre_fix + 'cube.ShowExperts',
     '/submit_tweet',    pre_fix + 'cube.SubmitTweet', 
	 '/delete_tweet',    pre_fix + 'cube.DeleteTweet',
     '/(.*)',           pre_fix + 'cube.Others',
)
