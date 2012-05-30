//event.html
jQuery(function(){  
    change_active_nav();
    show_keywords_freqs();
    get_keywords_array();
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


//event.html:   get 5 keywords arrays and then invoke display_all_keywords_graph to display them!!
function get_keywords_array(){
  var line1=[['23-May-08', 578.55], ['20-Jun-08', 566.5], ['25-Jul-08', 480.88], ['22-Aug-08', 509.84], 
      ['26-Sep-08', 454.13], ['24-Oct-08', 379.75], ['21-Nov-08', 303], ['26-Dec-08', 308.56], 
      ['23-Jan-09', 299.14], ['20-Feb-09', 346.51], ['20-Mar-09', 325.99], ['24-Apr-09', 386.15]];
  var line2=[['23-May-08', 518.55], ['20-Jun-08', 516.5], ['25-Jul-08', 280.88], ['22-Aug-08', 209.84], 
      ['26-Sep-08', 464.13], ['24-Oct-08', 389.75], ['21-Nov-08', 103], ['26-Dec-08', 238.56], 
      ['23-Jan-09', 199.14], ['20-Feb-09', 316.51], ['20-Mar-09', 355.99], ['24-Apr-09', 186.15]];
  var line3=[['23-May-08', 418.55], ['20-Jun-08', 416.5], ['25-Jul-08', 280.88], ['22-Aug-08', 209.84], 
      ['26-Sep-08', 464.13], ['24-Oct-08', 389.75], ['21-Nov-08', 103], ['26-Dec-08', 238.56], 
      ['23-Jan-09', 199.14], ['20-Feb-09', 316.51], ['20-Mar-09', 355.99], ['24-Apr-09', 186.15]];
  var line4=[['23-May-08', 318.55], ['20-Jun-08', 316.5], ['25-Jul-08', 280.88], ['22-Aug-08', 209.84], 
      ['26-Sep-08', 464.13], ['24-Oct-08', 389.75], ['21-Nov-08', 103], ['26-Dec-08', 238.56], 
      ['23-Jan-09', 199.14], ['20-Feb-09', 316.51], ['20-Mar-09', 355.99], ['24-Apr-09', 186.15]];
  var line5=[['23-May-08', 218.55], ['20-Jun-08', 216.5], ['25-Jul-08', 280.88], ['22-Aug-08', 209.84], 
      ['26-Sep-08', 464.13], ['24-Oct-08', 389.75], ['21-Nov-08', 103], ['26-Dec-08', 238.56], 
      ['23-Jan-09', 199.14], ['20-Feb-09', 316.51], ['20-Mar-09', 355.99], ['24-Apr-09', 186.15]];
  display_all_keywords_graph(line1, line2, line3, line4, line5);
}


//event.html:   #chartdiv display all 5 keywords graph
//TODO
function display_all_keywords_graph(line1, line2, line3, line4, line5){
  var plot1 = $.jqplot('chartdiv', [line1,line2,line3,line4,line5], {
      title:'Keywords Frequency Graph', 
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
          tickOptions:{
            formatString:'$%.2f'
            }
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
