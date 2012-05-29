//explore.html
jQuery(function(){ 
    //explore.html:	set textarea to be empty!
    jQuery('#textarea').val(''); 
    change_active_nav(); 
	// show the sentences people are asking~	
	show_sentences();
    //explore.html:	monitor the textarea, change the state of the button and word counter
    jQuery('#textarea').keyup(monitor_textarea); 
});


//explore.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_explore_id').addClass('active');
} 


//explore.html:	monitor the textarea for #analyze button
function monitor_textarea(){
	var maxLength = 140;
	var textareaVal = jQuery('#textarea').val().replace(/^\s*|\s*$/g,'');
	if(textareaVal == '') { 
  		jQuery('#analyze').attr('disabled', 'disabled');
	} else { 
		jQuery('#analyze').removeAttr('disabled');
	} 
} 



//explore.html:	show the people are analyzing 
function show_sentences(){
	var post_data = "show sentences";
	jQuery.ajax({
        url: 'show_sentences',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){      
			//below is to show the 6 latest sentences
            var count = 1; 
            var sentence_list = data.sentence_list;
            for(count = 1; count <= sentence_list.length; count++) {
                var posneg_selector_id = "#posneg_" + count; 
			    var sentence_selector_id = "#sentence_" + count; 
				jQuery(posneg_selector_id).text(sentence_list[count-1]['posneg']);	
				jQuery(sentence_selector_id).text(sentence_list[count-1]['sentence']);	
			}
            jQuery("#sentence_table").hide().fadeIn(600);
		}
		});
    return false;
}


//explore.html:	#analyze button!
jQuery('#analyze').click(function() {
    jQuery(this).button('loading'); 
    jQuery(this).popover('hide');
	var post_data = jQuery('#textarea').val().replace(/^\s*|\s*$/g,'');
	jQuery.ajax({
        url: 'sentiment_analysis',
		type: 'POST', 
		data: {signal: post_data},
        dataType: 'json',
		success: function(data){  
                var category = data.category;  
			    jQuery('#category').text(category).hide().fadeIn(1000);  
			    jQuery('#textarea').val('');
				monitor_textarea();
                jQuery('#analyze').button('reset');	
			}
		}).done(function() {
			    show_sentences();    
			}
     	);
    return false;
});

