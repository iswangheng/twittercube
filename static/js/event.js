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


//event.html:   show the keywords and their frequency ,AND 
//				AND will also show the related news title ragarding to the 5 hottest keywords  
//              AND will also show the graph of all 5 keywords
function show_keywords_freqs(){
    var date_string = jQuery('#keyword_date').val(); 
    var distance_str = jQuery("input[name='distanceRadios']:checked").val();
    // this if statement is just for demo.....TODO edit it later for further use when more data is available
    if(distance_str == '30'){
    	distance_str = 14
	} 
	jQuery.ajax({
        url: 'show_keywords_freqs',
		type: 'POST', 
		data: {date_str: date_string, distance_str: distance_str},
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
            var max_xaxis = keywords_lines.max_xaxis;
            var min_xaxis = keywords_lines.min_xaxis; 
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
			display_all_keywords_graph(line1, line2, line3, line4, line5, min_xaxis, max_xaxis, max_yaxis, keywords_str);
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
    var current_keyword = jQuery(this).text();
    jQuery('#current_keyword').text(current_keyword).hide().fadeIn(400);
    show_similar_graph();
});

 

//event.html:    when user click one keyword , this function would be invoked to show similar keywords and their graph
function show_similar_graph(){
    var date_str = jQuery('#keyword_date').val(); 
    var distance_str = jQuery("input[name='distanceRadios']:checked").val();
    // this if statement is just for demo.....TODO edit it later for further use when more data is available
    if(distance_str == '30'){
    	distance_str = 14
	}
    var current_keyword = jQuery('#current_keyword').text();
	jQuery.ajax({
        url: 'show_graph',
		type: 'POST', 
		data: {date_str: date_str, distance_str:distance_str, current_keyword: current_keyword},
        dataType: 'json',
		success: function(data){      
			//below is to show the 4 similar keywords and their graph(which are 5 arrays)
            var count = 1; 
            var keywords_lines = data.keywords_lines;
            var similar_keywords_list = keywords_lines.similar_keywords_list;
            var line1 = keywords_lines.line1;
            var line2 = keywords_lines.line2;
            var line3 = keywords_lines.line3;
            var line4 = keywords_lines.line4;
            var line5 = keywords_lines.line5;  
            var max_xaxis = keywords_lines.max_xaxis;
            var min_xaxis = keywords_lines.min_xaxis; 
            var max_yaxis = keywords_lines.max_yaxis;
            var keywords_str = keywords_lines.keywords_str;  
            for(count = 1; count <= similar_keywords_list.length; count++) {
                var similar_keyword_selector_id = "#similar_keyword_" + count;  
				jQuery(similar_keyword_selector_id).text(similar_keywords_list[count]).hide().fadeIn(800);   
			} 
			display_all_keywords_graph(line1, line2, line3, line4, line5, min_xaxis, max_xaxis, max_yaxis, keywords_str);
		}
		});
    return false;
}

//event.html:   #show_graph_button clicked
jQuery('#show_graph_button').click(function(){
    var current_keyword = jQuery('#current_keyword').text();
    if(current_keyword == 'All Keywords'){
        show_keywords_freqs();
    } else {
        show_similar_graph();
    }
});



 
//event.html:   #chartdiv display all 5 keywords graph 
function display_all_keywords_graph(line1, line2, line3, line4, line5, min_xaxis, max_xaxis, max_yaxis, keywords){
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
          min: min_xaxis,
          max: max_xaxis,
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
