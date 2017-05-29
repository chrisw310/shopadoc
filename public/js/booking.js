/**
 * Created by Cameron on 28/05/2017.
 */

//file to confirm the booking with the client and register the booking with the server
var docName;
var bookingData;

function decomposeBookingInfo(){
    docName = decodeURI(window.location.pathname.split('/')[2]);
    //variables we will need
    var d = null;
    var t = '';
    var pre = '';
    var lastDoc = '';
    var symp ='';
    var additional = '';
    //process hash string
    //day=2017-05-27T00:00:00.000Z&time=ten&preExisting=yes&lastDoctor=Never&symptom=Dying&additional=addition info goes here
    var hash = window.location.hash;
    hash = hash.substring(1,hash.length);
    hash = hash.split('&');
    for (var i=0; i<hash.length; i++){
        var s = hash[i].split('=');

        switch(s[0]){
            case 'day':
                d = new Date(s[1]);
                break;
            case 'time':
                t = s[1];
                break;
            case 'preExisting':
                pre = s[1];
                break;
            case 'lastDoctor':
                lastDoc = s[1];
                break;
            case 'symptom':
                symp = s[1];
                break;
            case 'additional':
                additional = s[1];
                break;
        }

        //console.log(hash[i])
    }
    bookingData = {doctorName: docName, day: d, time:t, preExisting:pre, lastDoctor: lastDoc, smyptoms: symp, additionInfo: additional};

    //console.log(bookingData);
}


function updateDoctorInfo(docs) {
    var times = {'seven':'7:00am','seventhirty':'7:30am','eight':'8:00am','eightthirty':'8:30am','nine:':'9:00am','ninethirty':'9:30am'
        ,'ten':'10:00am','tenthirty':'10:30am','eleven':'11:00am','eleventhirty':'11:30am','twelve':'12:00pm','twelvethirty':'12:30pm'
        ,'thirteen':'1:00pm','thirteenthirty':'1:30pm','fourteen':'2:00pm','fourteenthirty':'2:30pm','fifteen':'3:00pm'
        ,'fifteenthirty':'3:30pm','sixteen':'4:00pm','sixteenthirty':'4:30pm'};
    var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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

        document.getElementById('time').innerHTML = times[bookingData.time] + ', ' +
            days[bookingData.day.getDay()] +' ' + bookingData.day.getDate() + ' ' +
            months[bookingData.day.getMonth()] +' '+ bookingData.day.getFullYear(); //7:30am, May 14th, 2017
    }else{
        //potential to add html functionality to display no doctor found (new page?)
        console.error('No doctors found from DB')
    }
}

var socket = io.connect();
socket.on('connectedToServer', function (data) {
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    decomposeBookingInfo();
    socket.emit('listingDoctor',docName);
});

socket.on('listingDoctor', function(data){
    //console.log('Doctor response:');
    //console.log(data);
    updateDoctorInfo(data);
});

socket.on('bookingResponse',function(data){
    document.getElementById('bookingFeedback').innerHTML = data;
});


function bookAppointment(){
    if(profile === null){
        document.getElementById('bookingFeedback').innerHTML = 'Please Sign in to make a booking';
    }else {
        bookingData.clientEmail = profile.email;
        console.log(bookingData);
        //try send data to the server
        socket.emit('makeBooking', bookingData)
    }
}




var profile = null; // Google Sign-In profile

/**
 * Retrieve profile information on user signin
 */
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
            console.log(data);

            if (typeof data.err === "undefined") {
                profile.name = data.name;
                profile.pictureUrl = data.pictureUrl;
                profile.email = data.email;
                //console.log(data);
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
    profile = null;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out');
        $("#welcomeMsg, #signout").hide();
    });
}
