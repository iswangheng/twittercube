

//document.ready() function!
jQuery(function(){  
	change_nav_user();
});


//header.html:	just to change the user login and logout in the nav bar
function change_nav_user(){ 
	var user_screen_name = jQuery('#signin_dropdown>a').text(); 
    if(user_screen_name != ''){ 
		var profile_link = 'https://twitter.com/#!/' + user_screen_name;
		jQuery('#nav_user_profile>a').attr('href', profile_link); 
	} else {
		jQuery('.nav_user_pic').hide();
		jQuery('#signin_dropdown>a').html('Start Here<b class="caret"></b>');
		jQuery('#nav_user_profile').hide();
		var signin_link = 'sign_in_with_twitter';
		jQuery('#nav_user_signin>a').text('Sign In');
		jQuery('#nav_user_divider').hide();
		jQuery('#nav_user_signin>a').attr('href', signin_link);
	} 
}
