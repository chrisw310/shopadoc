
var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -27.469, lng: 153.025},
          zoom: 12
        });
      }
	  
	  var socket = io.connect();
var onSignIn;
var signOut;
var profile = null; // Google Sign-In profile
var loggedIn = null;

$.when(
    $.getScript("js/util.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
	if (loggedIn()) {
		profile = JSON.parse(sessionStorage.getItem("profile"));
		$("#welcomeMsg").text("Welcome, " + profile.name);
		$("#welcomeMsg, #signout").css("display","flex");
		$("#login").css("display","none");
	}
});