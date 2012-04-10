//asking.html:	set textarea to be empty!
jQuery(function(){
	jQuery('#textarea').val('');
    var user_link = "https://twitter.com/#!/" + jQuery('.screenname a').text()
    jQuery('.userpic a').attr("href", user_link) 
    jQuery('.name a').attr("href", user_link) 
    jQuery('.screenname a').attr("href", user_link) 
    jQuery('#user_info_table  a').attr("href", user_link)  
});
  

//asking.html:	monitor the textarea, change the state of the button and word counter
jQuery('#textarea').keyup(monitor_textarea); 

//asking.html:	monitor the textarea for word counter
function monitor_textarea(){
	var maxLength = 140
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
	var teststr = jQuery('#textarea').val().replace(/^\s*|\s*$/g,'');
	jQuery.ajax({
        url: 'show_experts',
		type: 'POST', 
		data: {signal: teststr},
		success: function(dataJSON){
				var data =jQuery.parseJSON(dataJSON); 
				jQuery('#category').text(data.category).hide().fadeIn(1000);
 				var expertsList = data.experts.replace(/^\s*|\s*$/g,'').split(' ');
				var experts = ''; 
				for(i = 0; i < expertsList.length; i++){
					experts = experts + expertsList[i] + ' ';
				} 
				jQuery('#experts').html(experts).hide().fadeIn(1500);
				jQuery('.experts-table').hide().fadeIn(1000);
				jQuery('#textarea').val(jQuery('#textarea').val() + ' ' + experts);
				monitor_textarea();
	  			jQuery('#show-experts').button('reset');	
			}
		});
    return false;
});


jQuery('#ask-them').click(function() {  
    var teststr = jQuery('#textarea').val(); 	
	var newtable = '<tr height="48px"><td width="48px">test</td><td width="82px">test@!adsfn</td><td>test</td></tr>';
	jQuery.ajax({
        url: 'submit_tweet',
		type: 'POST',
		data: {signal: teststr},
        success: function() {
			jQuery('.experts-table table tr').remove();
			jQuery('.experts-table>table').append(newtable);
			jQuery('.experts-table>table').append(newtable);
			jQuery('.experts-table>table').append(newtable);
        }
	});
    return false;
});
