
jQuery.noConflict();


//asking.html:	set textarea to be empty!
jQuery(function(){
	jQuery('#textarea').val('');
	//below is to show the correct info of current user
	show_user_info();  
});

 

//asking.html:	show the user info
function show_user_info(){
	var post_data = "show user info"
	jQuery.ajax({
        url: 'show_user_info',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){      
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
		});
    return false;
}


//asking.html:	update the user info
function update_user_info(){
	var post_data = "update_user_info"
	jQuery.ajax({
        url: 'update_user_info',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){
			jQuery('.userpic img').attr("src", data.user_img);
 			jQuery('.name>a').text(data.user_name);    
 			jQuery('.userlocation>a').text(data.user_location); 
 			jQuery('#statuses_count').text(data.user_statuses_count);  
 			jQuery('#following_count').text(data.user_following_count);  
 			jQuery('#followers_count').text(data.user_followers_count); 
			}
		});
    return false;
}


//asking.html:	monitor the textarea, change the state of the button and word counter
jQuery('#textarea').keyup(monitor_textarea); 

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


//asking.html:	show-experts button!
jQuery('#show-experts').click(function() {
    jQuery(this).button('loading'); 
	var post_data = jQuery('#textarea').val().replace(/^\s*|\s*$/g,'');
	jQuery.ajax({
        url: 'show_experts',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){  
                var category = data.category;  
			    jQuery('#category').text(category).hide().fadeIn(1000);
                jQuery('.experts-table>table>tbody tr').remove()
				var expertsList = data.experts_detailed_list;
                var experts = ''; 
                //ahhhhhh.... codes below are so dirty, remembe to rewrite them when im avaible
				for(i = 0; i < expertsList.length; i++){
					experts = experts + '@' + expertsList[i]['screen_name'] + ' ';
                    var expert_img_html = "<a href=https://twitter.com/#!/" + expertsList[i]['screen_name'] 
                                       + " target='_blank'><img src='" + expertsList[i]['profile_image_url'] + "' width='48px' height='48px'/></a>";
                    var expert_screen_name_html = "<a href=https://twitter.com/#!/" + expertsList[i]['screen_name'] 
                                       + " target='_blank'>@" + expertsList[i]['screen_name'] + "</a>";
                    var expert_description = expertsList[i]['description'] ;
                    var table_tr_new = "<tr height='48px'><td width='48px'>" + expert_img_html
                                   + "</td><td width='82px'>" + expert_screen_name_html
                                   + "</td><td>" + expert_description + "</td></tr>";
                    jQuery('.experts-table>table>tbody').append(table_tr_new);
				}  
				jQuery('.experts-table').hide().fadeIn(1000);
				jQuery('#textarea').val(jQuery('#textarea').val() + ' ' + experts);
				monitor_textarea();
                jQuery('#show-experts').button('reset');	
			}
		});
    return false;
});


jQuery('#ask-them').click(function() {  
    jQuery(this).button('loading'); 
    jQuery(this).popover('hide');
    var post_data = jQuery('#textarea').val(); 	 
	jQuery.ajax({
        url: 'submit_tweet',
		type: 'POST',
		data: {signal: post_data},
        dataType: 'json',
        success: function(data) { 
            var user_img = data.user_img;
            var user_name = data.user_name;
            var user_screen_name = data.user_screen_name;
            var tweet_time = data.tweet_time;
            var tweet_text = data.tweet_text;
            var user_link = "https://twitter.com/#!/" + user_screen_name;
            var user_tweets_clone = jQuery('#user_tweet_div_1').clone();
            jQuery('.user_tweet_div').remove();
            var count = 3;
			var id_num = "user_tweet_div_" + count; 
            user_tweets_clone.attr('id', id_num);
            user_tweets_clone.insertAfter(jQuery('#user_tweets'));
            //user_tweets_clone.insertAfter(jQuery('.user_tweet_div')); 
            jQuery('.user_img_div img').attr('src', user_img);
            jQuery('.user_img_div>a').attr('href', user_link);
            jQuery('.user_name_div>a').attr('href',user_link);
            jQuery('.user_name_div>a').text(user_name);
            jQuery('.user_screen_name_div>a').text(user_screen_name);
            jQuery('.user_time_div').text(tweet_time);
            jQuery('.user_text_div').text(tweet_text);       
            jQuery('.user_tweets_parent_div').hide().fadeIn(1000);
            
            jQuery('#ask-them').button('reset');
			//not using this fuction below, cuz its very time consuming and api is not stable while in HKUST campus. 
			//should improve later by better methods in the future
            //update_user_info();
        }
	});
    return false;
});
