$(document).ready(function() {

    $(".col-sm-3").css("z-index","0");
    $(".col-sm-3").click(function () {
        $(".col-sm-3").not(this).css("z-index","0");
       $(this).css("z-index","1");
        alert($(this).parent().contains(".open"));
    });
    
});


//~~Google Maps API functions~~//
var map;
var bounds;
var geocoder;
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.469, lng: 153.025},
        zoom: 12
    });
}

function addMapMarker(address,i) {
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var pos = results[0].geometry.location;
            if(i === 1){
                bounds = new google.maps.LatLngBounds(pos);
            }else{
                bounds.extend(pos);
            }
            var image = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red"+i+".png";
            var marker = new google.maps.Marker({
                map: map,
                position: pos,
                icon : image
            });
            map.fitBounds(bounds);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//~~Search database function~~//
window.onload = function(e){
    console.log("onload");
    document.getElementById('searchBar').onkeydown = function(event) {
        if (event.keyCode === 13) {
            searchDoctors();
        }
    }
};


//~~Update the list of doctors on the index.html page~~//
function listDoctors(docs){
    var htmlStr = "";
    for(var i=0; i<docs.length; i++){
        //console.log(docs[i]);
        var name = docs[i].name;
        var title = docs[i].title;
        var address = docs[i].address;
        addMapMarker(address,i+1);
        var minCost = docs[i].avgMinCost;
        var maxCost = docs[i].avgMaxCost;
        var fullStar = "&#9733";
        var emptyStar = "&#9734";
        var starCount = Math.floor(docs[i].averageRating);
        var starsString = fullStar.repeat(starCount) + emptyStar.repeat(5-starCount);
        var reviewStr = docs[i].reviewCount + " Reviews";
        var imgurl = "../images/" + docs[i].photo;
        //var imgurl = "../images/me.jpg";
        htmlStr += '<div class="listing" onclick="redirect(&#39'+name.toString()+'&#39)">' +
                '<p id="name">' + name +'</p>' +
                '<p id="title">' + title +'</p>' +
                '<p id="address">' + address + '</p>' +
                '<p id="doctorCost">$' + minCost + '-$' + maxCost + '</p>' +
                '<p id="reviewStars">' + starsString+ '</p>' +
                '<p id="reviewCount">' + reviewStr + '</p>' +
                '<img style="background-image:url(' + imgurl +')"/>' + '</div>';
    }
    //update the doctor content
    document.getElementById("doctorContainer").innerHTML = htmlStr;
    //update the height
    var h = docs.length*320 + 30;
    document.getElementById("content").style.height = h.toString() + 'px';
    h = docs.length*320 - 20;
    document.getElementById("map").style.height = h.toString() + 'px';
}

function redirect(name){
    window.location.replace('/listing/'+name);
}

//socket to talk to the server
//var port = "3456"; //remove later
//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
//var socket = io.connect('https://' + window.location.hostname + ":"+port ,{secure: true}); //works for localhost
var socket = io.connect();
socket.on('connectedToServer', function (data) {
    //listDoctors(5);
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    console.log('Searching Doctors');
    socket.emit('searchDoctors','all');
});

socket.on('doctors', function(data){
    console.log("Got doctors data.... Updating List");
    listDoctors(data);
});



function searchDoctors(){
    var str = document.getElementById("searchBar").value;
    if(str !== '') {
        socket.emit('searchDoctors', str);
    }
}

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