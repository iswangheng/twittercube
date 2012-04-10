#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',               pre_fix + 'cube.Index', 
     '/sign_in_with_twitter', pre_fix + 'cube.SignIn',
     '/callback',       pre_fix + 'cube.Callback',
     '/asking.html',    pre_fix + 'cube.Asking',
     '/show_experts',   pre_fix + 'cube.ShowExperts',
     '/submit_tweet',    pre_fix + 'cube.SubmitTweet',
     '/(.*)',           pre_fix + 'cube.Others',
)
