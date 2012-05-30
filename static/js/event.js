//event.html
jQuery(function(){  
    change_active_nav();
    show_keywords_freqs();
});

//event.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_event_id').addClass('active');
} 


//TODO edit it later...event.html:   show the similar words
function show_similar_words(){
    jQuery('#similar_keyword_1').hide().fadeIn(1000);
    jQuery('#similar_keyword_2').hide().fadeIn(1000);
    jQuery('#similar_keyword_3').hide().fadeIn(1000);
    jQuery('#similar_keyword_4').hide().fadeIn(1000);
}

//event.html:   show the keywords and their frequency ,AND   
//              will also show the graph of all 5 keywords
function show_keywords_freqs(){
    var date = jQuery('#keyword_date').val() 
	jQuery.ajax({
        url: 'show_keywords_freqs',
		type: 'POST', 
		data: {signal: date},
        dataType: 'json',
		success: function(data){      
			//below is to show the 5 hottest keywords and their freqs
            var count = 1; 
            var keywords_list = data.keywords_list;
            for(count = 1; count <= keywords_list.length; count++) {
                var keyword_selector_id = "#keyword_" + count; 
			    var freq_selector_id = "#frequency_" + count; 
				jQuery(keyword_selector_id).text(keywords_list[count-1]['keyword']).hide().fadeIn(800);	
				jQuery(freq_selector_id).text(keywords_list[count-1]['frequency']).hide().fadeIn(800);  
			} 
		}
		});
    return false;
}

//event.html:	#keyword_date changed!
jQuery('#keyword_date').click(function(){
    show_keywords_freqs();
});


//event.html:   #keyword clicked
jQuery('.keyword').click(function(){
    var current_keyword = jQuery(this).text()
    jQuery('#current_keyword').text(current_keyword).hide().fadeIn(400);
});
