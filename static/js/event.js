//event.html
jQuery(function(){  
    change_active_nav(); 
});

//event.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_event_id').addClass('active');
} 

