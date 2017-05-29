var socket = io.connect();
var onSignIn;
var signOut;
var profile = {}; // Google Sign-In profile
var loggedIn = null;

$.when(
    $.getScript("js/util.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
	//socket to talk to the server
	//var port = "3456"; //remove later
	//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
	//var socket = io.connect('https://' + window.location.hostname + ":"+port ,{secure: true}); //works for localhost
	//var socket = io.connect();
	socket.on('connectedToServer', function (data) {
		console.log(data); //prints the data from the server	
		if (loggedIn()) {
			//window.location.replace('/');
		} else {
			$("#signInDiv").show();
			//$("#signUpName").text(profile.name);
			//$("#signUpEmail").text(profile.email);
		}
	});

	/**
	* Retrieve profile information on user signin
	*/
	onSignIn = function(googleUser) {
		profileTemp = googleUser.getBasicProfile();
		
		if (socket.connected) {
			console.log("User logged in");
			var dataToEmit = {
				token: googleUser.getAuthResponse().id_token
			}
			socket.emit('clientSignIn', dataToEmit, function(data) {
				console.log("User login confirmed on server");
				console.log(data);

				if (typeof data.err == "undefined") {			
					profile.name = data.name;
					profile.pictureUrl = data.pictureUrl;
					profile.email = data.email;
					$("#welcomeMsg").text("Welcome, " + profile.name);
					$("#welcomeMsg, #signout").css("display","flex")
					sessionStorage.setItem("loggedIn", true);
					sessionStorage.setItem("profile", JSON.stringify(profile));
					console.log(profile);
					window.location.replace('/');
				}
			});
			
		}
	}
	
	
	
});

	