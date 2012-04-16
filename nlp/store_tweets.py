import MySQLdb 

def store(conn):
    #file = open("socialgraph.data","r")
    #file = open("userinfo.data","r")
    openfile = open("tweets.data","r")
    count = 0 
    while True:
	    content = openfile.readline() 
	    count = count +1 
	    if not content:
	        print 'not content'
	        break
	    else:
	        content = content[0:-1]            
            if not content:
                continue
            while content[-1] == "\\":
                content_left = openfile.readline()
                if content_left:
                    content = content[0:-1] + content_left[0:-1]
                else:
                    break
            store_tweets(conn,content)            
            #print content
            #store_socialgraph(conn,content)
            #store_userinfo(conn,content)
            if count == 0:
                break
    print 'count = ', count
    openfile.close()

def store_socialgraph(conn,str):
    cursor = conn.cursor()
    username = "swarm"
    following = "obama"
    strlist = str.split()
    if len(strlist) == 2:
        username = strlist[0]
        username = convert_string(username)
        print username
        following = strlist[1]
        following = convert_string(following)
        insert_str = "insert ignore into socialgraph(username,following) values('" + username + "','" + following + "')"
        cursor.execute(insert_str)
        conn.commit()

def store_userinfo(conn,str):
    cursor = conn.cursor()
    username = "swarm"
    timezone = "None"
    tweetsnum = 0
    followingnum = 0
    followernum = 0
    favornum = 0
    strlist = str.split() 
    if len(strlist) >= 5:
        username = strlist[0]
        tweetsnum = strlist[-4]
        followingnum = strlist[-3]
        followernum = strlist[-2]
        favornum = strlist[-1]       
        print username, " ", tweetsnum, " ", followingnum, " ", followernum, " ", favornum
        strlist =  strlist[1:-4]
        timezone = ""
        for e in strlist:
            timezone = timezone+e+" "
        timezone.strip()
        timezone = convert_string(timezone)
        print timezone
        insert_str = "insert ignore into userinfo(username,timezone,tweetsnum,followingnum,followernum,favornum) values('" \
                      + username + "','" + timezone\
                      + "','" +tweetsnum+"','"+followingnum+"','"+followernum+"','"+favornum+"')"
        cursor.execute(insert_str)
        conn.commit()
        
def store_tweets(conn,content):
    cursor = conn.cursor()
    username, tweettime, tweets = parse_content(content)
    print "check if parse_content is right: ", username, tweettime, tweets
    if username and tweets:
        tweets = tweets + " "
        insert_str = "insert ignore into tweets(username, tweettime, tweets) values('"\
                     + username + "','" + tweettime + "','" + tweets + "')"
        try:
            cursor.execute(insert_str)
        except:
            print "ooops, something is wrong with the insert string"
        conn.commit()
        
def parse_content(content):
    contentlist = content.split()
    print contentlist
    if len(contentlist) > 2:
        contentlist.reverse()
        username = contentlist.pop()
        tweettime = contentlist.pop() + " " + contentlist.pop()
        contentlist.reverse()
        tweets = " ".join(contentlist) 
        print "before ------------> ",tweets 
        tweets = convert_string(tweets)
        print "after---------->", tweets
        return username, tweettime, tweets
    else:
        return None,None,None
        
def convert_string(toconvert):
    i = 0
    while i < len(toconvert):
        if toconvert[i] == "'" or toconvert[i] == "\\" or toconvert[i] == '"':
            toconvert = toconvert[0:i] + "\\" + toconvert[i:]
            i += 1          
        i += 1      
    return toconvert 

def main():
    conn = MySQLdb.connect(host = "localhost",
    	                   user = "root",
	                	   passwd = "swarm",
			               db = "twitter_cube") 
    store(conn) 
    print str
    conn.close()

if __name__ == '__main__':
    main()
    print 'what the fuck'















