
jQuery.noConflict();


//asking.html:	set textarea to be empty!
jQuery(function(){
	jQuery('#textarea').val('');
	//below is to show the correct info of current user
	show_user_info();  
	//asking.html:	monitor the textarea, change the state of the button and word counter
	jQuery('#textarea').keyup(monitor_textarea); 
});

 

//asking.html:	show the user info 
function show_user_info(){
	var post_data = "show user info";
	jQuery.ajax({
        url: 'show_user_info',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){     
            var user_tweets_list = data.user_tweets_list;
            var user_link = "https://twitter.com/#!/" + data.user_screen_name; 
            jQuery('.userpic img').attr("src", data.user_img);
 			jQuery('.name>a').text(data.user_name);  
 			jQuery('.screenname>a').text('@' + data.user_screen_name);  
 			jQuery('.userlocation>a').text(data.user_location); 
 			jQuery('#statuses_count').text(data.user_statuses_count);  
 			jQuery('#following_count').text(data.user_following_count);  
 			jQuery('#followers_count').text(data.user_followers_count); 
			jQuery('.userpic a').attr("href", user_link);
			jQuery('.name a').attr("href", user_link);
			jQuery('.screenname a').attr("href", user_link); 
			jQuery('.userlocation a').attr("href", user_link);
			jQuery('#user_info_table  a').attr("href", user_link);
			}
		}).done(function() {
			    show_user_tweets();  
			}
     	);
    return false;
}
 
//asking.html:	show the 5 latest tweets of current user 
function show_user_tweets(){
	var post_data = "show user tweets";
	jQuery.ajax({
        url: 'show_user_tweets',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){     
            var count = 0
            var user_link = "https://twitter.com/#!/" + data.user_screen_name;
            var user_tweets_list = data.user_tweets_list;
            var user_tweets_clone = jQuery('#user_tweet_div_0').clone(); 
            jQuery('.user_tweet_div').remove();  
            for(count = 0; count < data.user_tweets_list.length; count++){
            	var id_num = "user_tweet_div_" + count; 
                var delete_div_id = "tweet_delete_div_" + count;               
                user_tweets_clone.attr('id', id_num);
                user_tweets_clone.insertAfter(jQuery('#user_tweets'));
				user_tweets_clone = jQuery('#user_tweet_div_0').clone(); 
                var id_time_selector = '#' + id_num + '>.tweet_time_div';
                var id_text_selector = '#' + id_num + '>.tweet_text_div'; 
                var id_tweet_id_selector = '#' + id_num + '>.tweet_id_input'; 
                var id_tweet_delete_selector = '#' + id_num + '>.tweet_delete_div'; 
            	jQuery(id_time_selector).text(user_tweets_list[count].tweet_time);
            	jQuery(id_text_selector).text(user_tweets_list[count].tweet_text); 
           		jQuery(id_tweet_id_selector).val(user_tweets_list[count].tweet_id);  
           		jQuery(id_tweet_delete_selector).attr('id', delete_div_id);  
            }     
            jQuery('.user_img_div img').attr('src', jQuery('.userpic img').attr('src'));
            jQuery('.user_img_div>a').attr('href', user_link);
            jQuery('.user_name_div>a').attr('href',user_link);
            jQuery('.user_name_div>a').text(jQuery('.name>a').text());
            jQuery('.user_screen_name_div>a').text('@' + data.user_screen_name);
            jQuery('.user_tweets_parent_div').hide().fadeIn(1000); 	 
            jQuery('.tweet_delete_div').hide().fadeIn(1000); 	 
			delete_tweet_handler();   
       }
	});
    return false;
}  

//asking.html:	monitor the textarea for word counter
function monitor_textarea(){
	var maxLength = 140;
	var textareaVal = jQuery('#textarea').val().replace(/^\s*|\s*$/g,'');
	if(textareaVal == '') {
  		jQuery('#show-experts').attr('disabled', 'disabled');
  		jQuery('#ask-them').attr('disabled', 'disabled');
	} else {
		jQuery('#show-experts').removeAttr('disabled');
		jQuery('#ask-them').removeAttr('disabled');
	}
	if(jQuery('#textarea').val().length > maxLength) {
		jQuery('#textarea').val(jQuery('#textarea').val().substring(0,maxLength));	
		jQuery('#word-counter').css({'background-color': '#E00000'});
	} else {	
		jQuery('#word-counter').css({'background-color': 'transparent'});
		var leftwords = maxLength - jQuery('#textarea').val().length;
		jQuery('#word-counter').val(leftwords);
	}
} 

//asking.html:  handle the delete option 
function delete_tweet_handler(){
	tweet_id = 1;
	jQuery('#tweet_delete_div_0').click(function(){ 
        tweet_id = jQuery(this).parent().find('.tweet_id_input').val(); 
		delete_tweet_ajax(tweet_id, '#tweet_delete_div_0');
	});
	jQuery('#tweet_delete_div_1').click(function(){
        tweet_id = jQuery(this).parent().find('.tweet_id_input').val();
		delete_tweet_ajax(tweet_id, '#tweet_delete_div_1'); 
	});
	jQuery('#tweet_delete_div_2').click(function(){
        tweet_id = jQuery(this).parent().find('.tweet_id_input').val();
		delete_tweet_ajax(tweet_id, '#tweet_delete_div_2'); 
	});
	jQuery('#tweet_delete_div_3').click(function(){
        tweet_id = jQuery(this).parent().find('.tweet_id_input').val();
		delete_tweet_ajax(tweet_id, '#tweet_delete_div_3'); 
	});
	jQuery('#tweet_delete_div_4').click(function(){
        tweet_id = jQuery(this).parent().find('.tweet_id_input').val();
		delete_tweet_ajax(tweet_id, '#tweet_delete_div_4'); 
	});
}

//asking.html:	sub function used in the delete_tweet_handler() function 
		//TODO
function delete_tweet_ajax(tweet_id, dom) {
    var post_data = tweet_id; 	 
	jQuery.ajax({
        url: 'delete_tweet',
		type: 'POST',
		data: {signal: post_data}, 
        success: function(data) {
			jQuery(dom).parent().fadeOut(600);
 	    }
	});
    return false;
}

 

