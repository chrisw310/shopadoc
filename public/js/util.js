console.log("debugger util.js");

gapi.load('auth2', function() {
	gapi.auth2.init();
});

/**
* Sign out of website (does not sign user out of Google)
*/
signOut = function () {
	try {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function() {
		  console.log('User signed out');
		  $("#welcomeMsg, #signout").hide();
		});
	}
	catch (err) {
		console.log(err);
	}
	if (socket.connected) {
		socket.emit('clientSignOut');
	}
	sessionStorage.setItem("loggedIn", false);
	$("#welcomeMsg, #signout").css("display","none");
	$("#login").css("display","flex");
	//window.location.replace('/');
};

/**
* Checks with server if user is logged in.
* true = logged in
* false = not logged in
*/
loggedIn = function() {
	/*if (socket.connected) {
		socket.emit('checkLoginStatus', function(data) {
			return data;
		});
	} else {
		return false;
	}*/
	return JSON.parse(sessionStorage.getItem("loggedIn"));
};


/**
* Take user to login/signup page
*/
$("#login").click(function() {
	if (!loggedIn()) {
		window.location.replace('/signup');
	} else {
		profile = JSON.parse(sessionStorage.getItem("profile"));
		$("#welcomeMsg").text("Welcome, " + profile.name);
		$("#welcomeMsg, #signout").css("display","flex");
		$("#login").css("display","none");
});

/**
* Redirect user to index page on logo click
*/
$("#logoLink").click(function() {
    window.location.replace('/');
 No newline at end of file
