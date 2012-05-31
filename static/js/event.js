//event.html
jQuery(function(){  
    change_active_nav();
    show_keywords_freqs();
    //get_keywords_array();
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
//				AND will also show the related news title ragarding to the 5 hottest keywords  
//              AND will also show the graph of all 5 keywords
function show_keywords_freqs(){
    var date = jQuery('#keyword_date').val() 
	jQuery.ajax({
        url: 'show_keywords_freqs',
		type: 'POST', 
		data: {signal: date},
        dataType: 'json',
		success: function(data){      
			//below is to show the 5 hottest keywords and their freqs AND ALSO the 5 keywords graph(which are 5 arrays)
            var count = 1; 
            var keywords_list = data.keywords_list;
            var keywords_lines = data.keywords_lines;
            var line1 = keywords_lines.line1;
            var line2 = keywords_lines.line2;
            var line3 = keywords_lines.line3;
            var line4 = keywords_lines.line4;
            var line5 = keywords_lines.line5; 
            var max_yaxis = keywords_lines.max_yaxis;
            var keywords_str = keywords_lines.keywords_str; 
            var news_titles = data.news_titles; 
            for(count = 1; count <= keywords_list.length; count++) {
                var keyword_selector_id = "#keyword_" + count; 
			    var freq_selector_id = "#frequency_" + count; 
				jQuery(keyword_selector_id).text(keywords_list[count-1]['keyword']).hide().fadeIn(800);	
				jQuery(freq_selector_id).text(keywords_list[count-1]['frequency']).hide().fadeIn(800);  
			} 
            for(count = 1; count <= news_titles.length; count++) {
                var title_selector_id = "#title_" + count;  
				jQuery(title_selector_id).text(news_titles[count-1]).hide().fadeIn(800);	 
			} 
			display_all_keywords_graph(line1, line2, line3, line4, line5, max_yaxis, keywords_str);
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

 
//event.html:   #chartdiv display all 5 keywords graph 
function display_all_keywords_graph(line1, line2, line3, line4, line5, max_yaxis, keywords){
  jQuery('#chartdiv').html(''); 
  var plot1 = $.jqplot('chartdiv', [line1,line2, line3, line4, line5], {
      title:'Keywords Frequency Graph: { ' + keywords + '}', 
 	  series:[ 
          {   
 			color: '#0101DF', 
          },  
          {   
 			color: '#FF8000',
          },  
          {   
 			color: '#B404AE',
          },  
          {   
 			color: '#3ADF00', 
          },  
          {   
 			color: '#000000',
          },  
      ],  
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{
            formatString:'%b&nbsp;%#d'
          } 
        },
        yaxis:{
          max: max_yaxis,
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5
      },
      cursor: {
        show: true
      }
  });  
}
