from datetime import datetime
import MySQLdb
import tweepy
import commands
import sys
import lid
import time

CONSUMER_KEY = "Bim7MtyWZjYvYIqImZWw"
CONSUMER_SECRET = "zwGggVuRJsDoomJWl8GJUGxQcPUi7OUVkbtgOOLpx0w"
ACCESS_TOKEN_KEY = "80598389-S66VzjF5IiCs2Yga9EimZi7fkCQl9nKNLTlwhLs"
ACCESS_TOKEN_SECRET = "hv6K3Fydf7ZY7mBIQIvwIf6wjCzdZn6wDws7zY2AE"


def crawl_tweet():
    conn = MySQLdb.connect (host = "localhost",
                            user = "root",
                            passwd = "swarm",
                            db = "twitter_cube")
    cursor = conn.cursor() 
    while 1:
        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET) 
        auth.set_access_token(ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET)
        api = tweepy.API(auth) 
        tweets_list = api.public_timeline()
        count = 1
        for tweet in tweets_list:
            if tweet == None:
                continue
            if len(tweet.text) < 5:
                print "text", tweet.text
                print "<<<<<<<<<< len < 5 <<<<<<<<<<"
            elif detect(tweet.text) != 'English':
                print "text", tweet.text
                print "+++++++++++NOT ENGLISH+++++++++"
            else:
                store_tweet(cursor, conn, tweet)
            print "COUNT--------------> ",count
            count = count + 1
        time.sleep(20)
    cursor.close()
    conn.close()

def store_tweet(cursor, conn, tweet):
    try: 
        print "screen_name: ", tweet.user.screen_name
        print "tweet_id: ", tweet.id
        print "image_url: ", tweet.user.profile_image_url
        print "text: ", tweet.text 
        screen_name = tweet.user.screen_name.encode("utf-8")
        tweet_id = tweet.id
        profile_image_url = tweet.user.profile_image_url.encode("utf-8")
        created_at = str(tweet.created_at).strip()
        text = tweet.text.encode("utf-8")
        #print "created_at: ", created_at
        #created_at = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S")
        print " created_at___> ", created_at
        store_sql = "INSERT INTO tweets(id, screen_name, image_url, created_at, text) \
                         VALUES('%s', '%s', '%s', '%s', '%s')" \
                             % (str(tweet_id), str(screen_name), str(profile_image_url), str(created_at), str(text))  
        cursor.execute(store_sql)
        conn.commit()
    except:
        conn.rollback() 
        print "DATABASE ERROR...:", sys.exc_info()[0]
 
def detect(text):
    myLid = lid.Lid()
    return myLid.checkText(text)

if __name__ == '__main__':    
    crawl_tweet()
