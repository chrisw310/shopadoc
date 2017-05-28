/**
 * Created by Cameron on 16/05/2017.
 */
//Js to control the listings page

//~~Google Maps API functions~~//
var map;
var geocoder;
//Initalize the map
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.469, lng: 153.025},
        zoom: 12
    });
}
//to add a marker and make it the focus of the map
function addMapMarker(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var pos = results[0].geometry.location;
            var image = "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red1.png";
            var marker = new google.maps.Marker({
                map: map,
                position: pos,
                icon : image,
                scrollwheel: false
            });
            map.setCenter(pos);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function updateDoctorInfo(docs) {
    if (docs.length > 0){
    	var i =0;
		//console.log(docs[i]);
        document.getElementById("name").innerHTML = docs[i].name;
        document.getElementById("title").innerHTML = docs[i].title;
        document.getElementById("address").innerHTML = docs[i].address;
        document.getElementById("doctorCost").innerHTML = '$' + docs[i].avgMinCost + '-$' + docs[i].avgMaxCost;
        var starCount = Math.floor(docs[i].averageRating);
        var starsString = "&#9733".repeat(starCount) + "&#9734".repeat(5 - starCount);
        document.getElementById("reviewStars").innerHTML = starsString;
        document.getElementById("reviewCount").innerHTML = docs[i].reviewCount + " Reviews";
        var imgurl = "../images/" + docs[i].photo;
        document.getElementById("doctorImage").style.backgroundImage = 'url(' + imgurl + ')';
        document.getElementById("doctorDescription").innerHTML = docs[i].description;
        addMapMarker(docs[i].address);
	}else{
    	//potential to add html functionality to display no doctor found (new page?)
    	console.error('No doctors found from DB')
	}
}

function updateDoctorReviews(docs){
    if (docs.length > 0){
        var reviewStr = '';
        console.log(docs);
        for(var i=0; i<docs.length; i++){
            var username = docs[i].reviewerName;
            var starCount = Math.floor(docs[i].rating);
            var comment = docs[i].comment;
            var starsString = "&#9733".repeat(starCount) + "&#9734".repeat(5-starCount);
            reviewStr += '<div class="review"><p>' + username + '</p><p>' + starsString + '</p><p>' + comment + '</p></div>';

        }
        document.getElementById("reviewContainer").innerHTML = reviewStr;
    }else{
        //potential to add html functionality to display no doctor found (new page?)
        console.error('No reviews found in the DB')
    }
}

function addReview(){
    var docName = decodeURI(window.location.pathname.split('/')[2]);
    var rName = profile.name;
    var photoURL = profile.pictureUrl;
    var r = document.getElementById("reviewForm").rating.value;
    if (r === ''){
        document.getElementById('ratingFeedback').innerHTML = "Please Selected A Rating";
    }else {
        document.getElementById('ratingFeedback').innerHTML = '';
        var c = document.getElementById('reviewCommentBox').value;
        var doc = {doctorName: docName, rating: r, reviewerName: rName, reviewerPhotoURL: photoURL, comment: c};
        socket.emit('addReview', doc);
    }
}


//socket to talk to the server
//var port = "3000"; //remove later
//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
//var socket = io.connect('https://' + window.location.hostname + ":"+port); //works for localhost
var socket = io.connect();
socket.on('connectedToServer', function (data) {
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    var docName = decodeURI(window.location.pathname.split('/')[2]);
    socket.emit('listingDoctor',docName);
    socket.emit('requestReviews',docName);
});

socket.on('listingDoctor', function(data){
	//console.log('Doctor response:');
    //console.log(data);
    updateDoctorInfo(data);
});

socket.on('recievedReviews',function(data){
    console.log('Recieved reviews');
    updateDoctorReviews(data);
});

socket.on('addReviewResponse',function(data){
    document.getElementById('ratingFeedback').innerHTML = data;
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