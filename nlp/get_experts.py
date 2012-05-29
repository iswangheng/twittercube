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


class UserScore:
    user_score = {"artdesign": 1,
                  "autos": 1,
                  "business": 1,
                  "education": 1,
                  "entertainment": 1,
                  "fashion": 1,
                  "food": 1,
                  "health": 1,
                  "music": 1,
                  "politics": 1,
                  "religion": 1,
                  "scitech": 1,
                  "sports": 1,
                  "travel": 1,
                  }
    
    def __init__(self):
        self.user_score['artdesign'] = 1
        self.user_score['autos'] = 1
        self.user_score['business'] = 1
        self.user_score['education'] = 1
        self.user_score['entertainment'] = 1
        self.user_score['fashion'] = 1
        self.user_score['food'] = 1
        self.user_score['health'] = 1
        self.user_score['music'] = 1
        self.user_score['politics'] = 1
        self.user_score['religion'] = 1
        self.user_score['scitech'] = 1
        self.user_score['sports'] = 1
        self.user_score['artdesign'] = 1
        self.user_score['travel'] = 1
       

def classify_user():
    conn = MySQLdb.connect (host = "localhost",
                            user = "root",
                            passwd = "swarm",
                            db = "twitter_cube")
    cursor = conn.cursor()
    username = "init"
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET) 
    auth.set_access_token(ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET)
    api = tweepy.API(auth) 
    score = UserScore() 
    for q_str in score.user_score.keys():
        if q_str == "artdesign":
            q_str = "art design"
        if q_str == "scitech":
            q_str = "science tech"
        print "query str: ", q_str
        print "will search users!!"
        searched_users = api.search_users(q_str, per_page="20",page="5")
        for user in searched_users:
            username = user.screen_name
            print username
            classify_user_tweets(api, cursor, conn, username) 
        print "--------------***************----------------" 
    cursor.close()
    conn.close()


def store_expert(cursor, conn, username, user_img, user_description, score):   
    username = username.encode("utf-8")
    user_img = user_img.encode("utf-8")
    user_description = user_description.encode("utf-8")
    print "username----> ", username, "  user_img--> ", user_img, "  userDescrip--> ", user_description
    try: 
        store_sql = "INSERT INTO experts(username, user_img, user_description, artdesign, autos, \
                     business, education, entertainment, fashion, \
                     food, health, music, politics, religion, scitech, \
                     sports, travel) VALUES('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', \
                                 '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" \
                                  % (username ,user_img, user_description, str(score['artdesign']), str(score['autos']),  \
                                  str(score['business']), str(score['education']), \
                                  str(score['entertainment']), str(score['fashion']) , \
                                  str(score['food']), str(score['health']), \
                                  str(score['music']), str(score['politics']), \
                                  str(score['religion']), str(score['scitech']), \
                                  str(score['sports']), str(score['travel']) ) 
        cursor.execute(store_sql)
        conn.commit()
    except:
        conn.rollback() 
        print "DATABASE ERROR...:", sys.exc_info()[0]
            

def classify_user_tweets(tweepy_api, cursor, conn, username):  
    tobe_classified_text = "" 
    api = tweepy_api
    CONTINIOUS_NUM = 10
    score = UserScore() 
    is_English = True
    try: 
        print "username: ", username
        user = api.get_user(screen_name = username) 
        user_img = user.profile_image_url
        user_description = user.description
        user_timeline = api.user_timeline(screen_name=username, count="200")
        CONTINIOUS_NUM = len(user_timeline) / 20 
        if CONTINIOUS_NUM == 0:
            CONTINIOUS_NUM = 1
        #print 'len: timeline: ', len(user_timeline) 
        count = 1 
        for tweet in user_timeline: 
            new_tweet_text = remove_at(remove_http(tweet.text))
            print "now---> ",count, new_tweet_text
           	#TODO if not english break, next user!   
            if count == 1 and detect(new_tweet_text) != 'English':
                is_English = False
                print "NOT ENGLISH!!___________-----------------+++++++++"
                break;
            tobe_classified_text = tobe_classified_text + " " + new_tweet_text
            if count % CONTINIOUS_NUM == 0:
                print "WILL encode utf-8 to the tobe_classified_text"
                tobe_classified_text = tobe_classified_text.encode("utf-8")
                category = get_category(tobe_classified_text)
                print "category--> ", category
                score.user_score[category] = score.user_score[category] + 1
                tobe_classified_text = "" 
            count = count + 1  
        if is_English:
            normalize_score(score.user_score)
            store_expert(cursor, conn, username, user_img, user_description, score.user_score)  
        #just for rate limit: no more than 150 requests per hour!!
        #time.sleep(5)  #sleep 30
    except tweepy.TweepError, msg:
        print 'tweepy error: %s' % msg
    except:
        print "oooops...sth is wrong Unexpected error:", sys.exc_info()[0]

#Removes the @*** from the text
def remove_at(text):
    text_without_at = ''
    start_index = text.find('@')
    if start_index == -1:
        text_without_at = text
    else:
        i = start_index
        while i < len(text):
            if text[i] == ' ':
                break
            i = i + 1    
        end_index = i 
        text_without_at = text[0:start_index] + text[end_index:] 
        text_without_at = remove_at(text_without_at)
    return text_without_at

#Removes the http* from the text
def remove_http(text):
    text_without_http = ''
    start_index = text.find('http')
    if start_index == -1:
        text_without_http = text
    else:
        i = start_index
        while i < len(text):
            if text[i] == ' ':
                break
            i = i + 1    
        end_index = i 
        text_without_http = text[0:start_index] + text[end_index:] 
        text_without_http = remove_http(text_without_http)
    return text_without_http


def normalize_score(score):
    sum = 0
    for value in score.itervalues():
        sum = sum + value 
    for key, value in score.iteritems():
        n_value = (value * 10000)/sum
        score[key] = n_value
    for key, value in score.iteritems():
        print 'after: ', key, value

def detect(text):
    myLid = lid.Lid()
    return myLid.checkText(text)


def get_category(text):
    savetestFile = open('testFile','w')
    savetestFile.write(text)
    savetestFile.close()
    cmd = 'java -jar classifyText.jar ' + 'testFile'
    category = commands.getoutput(cmd)     
    index = category.index(':') + 1
    category = category[index:]
    category = category.strip()
    if category == "art&design":
        category = "artdesign"
    elif category == "sci&tech":
        category = "scitech"
    return category 

##update userinfo set isClassified = 0 where isClassified =1

if __name__ == '__main__':    
    classify_user()
