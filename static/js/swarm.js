 

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
                //TODO ahhhhhh.... codes below are so dirty, remembe to rewrite them when im avaible
				for(i = 0; i < expertsList.length; i++){
					experts = experts + '@' + expertsList[i]['screen_name'] + ' ';
                    var expert_img_html = "<a href=https://twitter.com/#!/" + expertsList[i]['screen_name'] 
                                       + " target='_blank'><img src='" + expertsList[i]['user_img'] + "' width='48px' height='48px'/></a>";
                    var expert_screen_name_html = "<a href=https://twitter.com/#!/" + expertsList[i]['screen_name'] 
                                       + " target='_blank'>@" + expertsList[i]['screen_name'] + "</a>";
                    var expert_description = expertsList[i]['user_description'] ;
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



//asking.html:   when click the experts, toggle the table
jQuery('#experts-title').click(function() {     
	jQuery('#experts-table-inside').toggle();
});


//asking.html:	ask-them button!
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
            var user_tweets_list = data.user_tweets_list;
            var user_link = "https://twitter.com/#!/" + data.user_screen_name;
            var user_tweets_clone = jQuery('#user_tweet_div_0').clone(); 
            jQuery('.user_tweet_div').remove(); 
            var count = 0
            for(count = 0; count < 5; count++){
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
            jQuery('.user_img_div img').attr('src', data.user_img);
            jQuery('.user_img_div>a').attr('href', user_link);
            jQuery('.user_name_div>a').attr('href',user_link);
            jQuery('.user_name_div>a').text(data.user_name);
            jQuery('.user_screen_name_div>a').text('@' + data.user_screen_name); 
            jQuery('.tweet_id_input').text(data.tweet_id); 
		    jQuery('.experts-table').hide();    
            jQuery('.user_tweets_parent_div').hide().fadeIn(1000); 		
			jQuery('.tweet_delete_div').hide().fadeIn(100); 
			delete_tweet_handler(); 
            jQuery('#ask-them').button('reset');
        }
	});
    return false;
});
 

