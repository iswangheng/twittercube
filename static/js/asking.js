jQuery.noConflict();


//document.ready() function!
jQuery(function(){
	//asking.html:	set textarea to be empty!
	jQuery('#textarea').val('');
	//below is to show the correct info of current user
    change_active_nav();
	show_user_info();  
	//asking.html:	monitor the textarea, change the state of the button and word counter
	jQuery('#textarea').keyup(monitor_textarea); 
});

//asking.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').removeClass('active');
	jQuery('#nav_asking_id').addClass('active');
} 

//asking.html:	show the user info 
function show_user_info(){
	var post_data = "show user info";
	jQuery.ajax({
        url: 'show_user_info',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){      
            var user_link = "https://twitter.com/#!/" + data.user_screen_name;    
			jQuery('.userpic a').attr("href", user_link);
			jQuery('.name a').attr("href", user_link);
			jQuery('.screenname a').attr("href", user_link); 
			jQuery('.userlocation a').attr("href", user_link);
			jQuery('#user_info_table  a').attr("href", user_link); 

			//below is to show the 6 latest quesions
            var count = 1;
            var question_list = data.question_list;
            for(count = 1; count <= question_list.length; count++) {
			    var question_selector_id = "#question_" + count;
				jQuery(question_selector_id).text(question_list[count-1]['question']);	
			}
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
			show_user_tweets_html(data); 
			delete_tweet_handler();   
       }
	});
    return false;
}  


//asking.html:	show user tweets (after getting tweets useing ajax)
function show_user_tweets_html(data){
    var count = 0
    var user_link = "https://twitter.com/#!/" + data.user_screen_name;
    var user_tweets_list = data.user_tweets_list;
    var user_tweets_clone = jQuery('#user_tweet_div_init').clone(); 
    jQuery('.user_tweets_parent_div .user_tweet_div').remove();      
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
    	jQuery(id_text_selector).html(user_tweets_list[count].tweet_text); 
   		jQuery(id_tweet_id_selector).val(user_tweets_list[count].tweet_id);  
   		jQuery(id_tweet_delete_selector).attr('id', delete_div_id);  
    }      
    jQuery('.user_img_div img').attr('src', jQuery('.userpic img').attr('src'));
    jQuery('.user_img_div>a').attr('href', user_link);
    jQuery('.user_name_div>a').attr('href', user_link);
    jQuery('.user_name_div>a').text(jQuery('.name>a').text());
    jQuery('.user_screen_name_div>a').text('@' + data.user_screen_name);
    jQuery('.user_screen_name_div>a').attr('href', user_link);
	jQuery('.experts-table').hide();  
    jQuery('.user_tweets_parent_div').hide().fadeIn(1000); 	 
    jQuery('.tweet_delete_div').hide().fadeIn(1000); 
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
			jQuery(dom).parent().hide(600);
 	    }
	});
    return false;
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
                //TODO ahhhhhh.... codes below are so dirty, remember to rewrite them when i am available
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
			show_user_tweets_html(data);
            jQuery('#ask-them').button('reset');
	        jQuery('#textarea').val(''); 
			delete_tweet_handler();   
        }
	});
    return false;
});
 

 

