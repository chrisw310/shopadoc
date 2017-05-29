/**
 * Created by Cameron on 16/05/2017.
 */
//Js to control the listings page

var socket = io.connect();
var onSignIn;
var signOut;
var profile = null; // Google Sign-In profile
var loggedIn = null;

$.when(
    $.getScript("../js/util.js"),
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

//~~Google Maps API functions~~//
var map;
var geocoder;
//Initalize the map
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.469, lng: 153.025},
        zoom: 12,
        scrollwheel: false
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
                icon : image
            });
            map.setCenter(pos);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

var docName;
var bookingDay = '';
var bookingTime = '';
var lastTimeSelected = '';

function updateDoctorInfo(docs) {
    document.getElementById('doctorLoading').style.display = 'none';
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
        document.getElementById("address").innerHTML = 'Doctor Not found :(';
    	console.error('No doctors found from DB')
	}
}

function updateDoctorAvailability(docs){
    var keys = ['seven','seventhirty','eight','eightthirty','nine','ninethirty','ten','tenthirty','eleven','eleventhirty','twelve','twelvethirty','thirteen','thirteenthirty','fourteen','fourteenthirty','fifteen','fifteenthirty','sixteen','sixteenthirty'];
    var timeStrings = ['7:00am','7:30am','8:00am','8:30am','9:00am','9:30am','10:00am','10:30am','11:00am','11:30am','12:00pm','12:30pm','1:00pm','1:30pm','2:00pm','2:30pm','3:00pm','3:30pm','4:00pm','4:30pm'];

    if(docs.length >= 1) {
        var today = docs[0];
        setBookingDay(today.day);
        //console.log(today.times);
        //Object.keys(today.times).length
        var d = new Date(today.day);
        htmlString = d.toDateString();
        htmlString += '<div class="row">';
        for (var i = 0; i < keys.length; i++) {
            if (i % 4 === 0) {
                if (i > 1) {
                    htmlString += '</div>';
                }
                htmlString += '<div class="col-sm-1">'
            }
            htmlString += '<button id="book' + keys[i] + '" type="button" class="btn btn-';
            if (today.times[keys[i]] === 1) {
                htmlString += 'success" onclick="setBookingTime(&#39' + keys[i] + '&#39)">';
            } else {
                htmlString += 'basic">'
            }

            htmlString += timeStrings[i] + '</button>';
        }

        htmlString += '</div></div>';
    }else{
        htmlString = 'no available times found';
    }
    document.getElementById("times").innerHTML = htmlString;
}

function setBookingDay(day){
    bookingDay = day;
}

//called when the user clicks one of the available booking times
//saves the time selected
//changes the button selected to blue and the last selected button (if there was one) back to green
function setBookingTime(time){
    document.getElementById('listingResponse').innerHTML = '';
    document.getElementById('book'+time).classList.remove('btn-success');
    document.getElementById('book'+time).classList.add('btn-info');
    if (lastTimeSelected !== '' && lastTimeSelected !== 'book'+time){
        document.getElementById(lastTimeSelected).classList.remove('btn-info');
        document.getElementById(lastTimeSelected).classList.add('btn-success');
    }
    lastTimeSelected = 'book'+time;
    bookingTime = time;
    //console.log('Slecting time: ' + time);
}

function makeBooking(){
    //var docName = decodeURI(window.location.pathname.split('/')[2]);
    if (bookingTime ==='') {
        document.getElementById('listingResponse').innerHTML = 'Please Select a time first';
    }else {
        window.location = window.location.origin + '/preconfirm/' + docName + '#day=' + bookingDay + '&time=' + bookingTime;
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
            
            reviewStr += '<div class="review">' + '<img src="' + docs[i].reviewerPhotoURL + '" />' + '<p>' + username + '</p><p>' + starsString + '</p><p>' + comment + '</p></div>';

        }
        document.getElementById("reviewContainer").innerHTML = reviewStr;
        document.getElementById("reviewContainer").style.height = '';
    }else{
        //potential to add html functionality to display no doctor found (new page?)
        console.error('No reviews found in the DB');
        document.getElementById("reviewContainer").innerHTML = 'No Reviews Found';
    }
}

function addReview(){
    //var docName = decodeURI(window.location.pathname.split('/')[2]);
    if(profile === null){
        document.getElementById('ratingFeedback').innerHTML = "Please Sign in to submit a review <br>";
        return;
    }
    var rName = profile.name;
    var photoURL = profile.pictureUrl;
    var r = document.getElementById("reviewForm").rating.value;
    if (r === ''){
        document.getElementById('ratingFeedback').innerHTML = "Please Select A Rating <br>";
    }else {
        document.getElementById('ratingFeedback').innerHTML = '';
        var c = document.getElementById('reviewCommentBox').value;
        var doc = {doctorName: docName, rating: r, reviewerName: rName, reviewerPhotoURL: photoURL, comment: c};
        socket.emit('addReview', doc);
    }
}

function saveDoctor(){
    if(profile !== null){
        if(typeof(profile.token) === 'undefined'){
            document.getElementById('listingResponse').innerHTML = 'Please Sign in to save a doctor';
        }else{
            //signed in a token is defined
            var data = {token: profile.token, docName: docName};
            socket.emit('addSavedDoctors',data,function(resp){
                document.getElementById('listingResponse').innerHTML = resp;
            })
        }
    }else{
        document.getElementById('listingResponse').innerHTML = 'Please Sign in to save a doctor';
    }
}


//socket to talk to the server
//var port = "3000"; //remove later
//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
//var socket = io.connect('https://' + window.location.hostname + ":"+port); //works for localhost
//var socket = io.connect();
socket.on('connectedToServer', function (data) {
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    docName = decodeURI(window.location.pathname.split('/')[2]);
    socket.emit('listingDoctor',docName);
    socket.emit('requestReviews',docName);
    socket.emit('requestTimes',docName);
});

socket.on('listingDoctor', function(data){
	//console.log('Doctor response:');
    //console.log(data);
    updateDoctorInfo(data);
});

socket.on('recievedReviews',function(data){
    console.log('Received reviews');
    updateDoctorReviews(data);
});

socket.on('recievedTimes',function(data){
    console.log('Received Availability');
    console.log(data);
    updateDoctorAvailability(data);
});

socket.on('addReviewResponse',function(data){
    if(data === 'Review Added'){
        //document.getElementById("reviewContainer").innerHTML = '<div class="SaDloading" style="top:300px"></div>';
        socket.emit('requestReviews',docName);
    }
    document.getElementById('ratingFeedback').innerHTML = data;
});



//var profile = null; // Google Sign-In profile

/**
* Retrieve profile information on user signin
*/
/*
function onSignIn(googleUser) {
	profile = googleUser.getBasicProfile();
	//console.log(profile.getEmail());
	
	if (socket.connected) {
		console.log("User logged in");
		var dataToEmit = {
			token: googleUser.getAuthResponse().id_token
		};
		socket.emit('clientSignIn', dataToEmit, function(data) {
			console.log("User login confirmed on server");
			//console.log(data);

			if (typeof data.err === "undefined") {
			    profile.token = dataToEmit.token;
				profile.name = data.name;
				profile.pictureUrl = data.pictureUrl;
				//profile.email = data.email;
				//console.log(data);
				$("#welcomeMsg").text("Welcome, " + profile.name);
				$("#welcomeMsg, #signout").css("display","flex")


                var data = {token: profile.token, docName: docName};
                socket.emit('getSavedDoctors',data,function(resp){
                    console.log('recieved saved doctors');
                    console.log(resp);
                })
			}
		});
	}
}*/

/**
* Sign out of website (does not sign user out of Google)
*/
/*
function signOut() {
    profile = null;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out');
	  $("#welcomeMsg, #signout").hide();
    });
}*/