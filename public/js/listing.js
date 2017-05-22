/**
 * Created by Cameron on 16/05/2017.
 */
//Js to control the listings page



//~~Google Maps API functions~~//
var map;
var geocoder;
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.469, lng: 153.025},
        zoom: 12
    });
}


//socket to talk to the server
//var port = "3000"; //remove later
//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
//var socket = io.connect('https://' + window.location.hostname + ":"+port); //works for localhost
var socket = io.connect();
socket.on('connectedToServer', function (data) {
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    socket.emit('listingDoctor',decodeURI(window.location.pathname.split('/')[2]));
});

socket.on('listingDoctor', function(data){
   console.log(data);
});

var profile = null; // Google Sign-In profile

/**
* Retrieve profile information on user signin
*/
function onSignIn(googleUser) {
	profile = googleUser.getBasicProfile();
	
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
				$("#welcomeMsg").text("Welcome, " + profile.name);
				$("#welcomeMsg, #signout").css("display","flex")
			}
		});
	}
}

/**
* Sign out of website (does not sign user out of Google)
*/
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out');
	  $("#welcomeMsg, #signout").hide();
    });
}