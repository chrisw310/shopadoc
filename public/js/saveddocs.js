
var socket = io.connect();
var onSignIn;
var signOut;
var profile = null; // Google Sign-In profile
var loggedIn = null;
//var docName = '';

$.when(
    $.getScript("/js/util.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    $('.parallax-window').parallax({imageSrc: '/images/background.png'});

    //~~Search database function~~//
    console.log("onload");
    $("#searchBar").keydown(function() {
        if (event.keyCode === 13) {
            searchDoctors();
        }
    });

    /*$(".col-sm-6:contains('Saved')").click(function() {
        window.location.replace('/saved');
    });*/

    $(".col-sm-3").css("z-index","0");
    $(".col-sm-3").click(function () {
        $(".col-sm-3").not(this).css("z-index","0");
        $(this).css("z-index","1");
        alert($(this).parent().contains(".open"));
    });

    if (loggedIn()) {
        profile = JSON.parse(sessionStorage.getItem("profile"));
        $("#welcomeMsg").text("Welcome, " + profile.name);
        $("#welcomeMsg, #signout").css("display","flex");
        $("#login").css("display","none");

        //var data = {token: profile.token, docN};
        socket.emit('getSavedDoctors',{token: profile.token},function(resp){
            console.log('recieved saved doctors');
            listDoctors(resp);
            //console.log(resp);
        })
    }else{
        document.getElementById("doctorContainer").innerHTML = '<div class="listing"><p id="title"> Please sign in to view saved doctors </p></div>';
    }
});

/*window.onresize = function() {
 google.maps.event.trigger(map, 'resize');
 };*/


//~~Google Maps API functions~~//
var map;
var bounds;
var geocoder;
function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -27.469, lng: 153.025},
        zoom: 12,
        scrollwheel: false
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




//~~Update the list of doctors on the index.html page~~//
function listDoctors(docs) {
    //document.getElementById('mapContainer').style.display = '';
    var htmlStr = "";
    for (var i = 0; i < docs.length; i++) {
        //console.log(docs[i]);
        var name = docs[i].name;
        var title = docs[i].title;
        var address = docs[i].address;
        addMapMarker(address, i + 1);
        var minCost = docs[i].avgMinCost;
        var maxCost = docs[i].avgMaxCost;
        var fullStar = "&#9733";
        var emptyStar = "&#9734";
        var starCount = Math.floor(docs[i].averageRating);
        var starsString = fullStar.repeat(starCount) + emptyStar.repeat(5 - starCount);
        var reviewStr = docs[i].reviewCount + " Reviews";
        var imgurl = "../images/" + docs[i].photo;
        //var imgurl = "../images/me.jpg";
        htmlStr += '<div class="listing" onclick="redirect(&#39' + name.toString() + '&#39)">' +
            '<p id="name">' + name + '</p>' +
            '<p id="title">' + title + '</p>' +
            '<p id="address">' + address + '</p>' +
            '<p id="doctorCost">$' + minCost + '-$' + maxCost + '</p>' +
            '<p id="reviewStars">' + starsString + '</p>' +
            '<p id="reviewCount">' + reviewStr + '</p>' +
            '<img style="background-image:url(' + imgurl + ')"/>' + '</div>';
    }
    //update the doctor content
    document.getElementById("doctorContainer").innerHTML = htmlStr;
    //update the height
    var h = docs.length * 320 + 30;
    document.getElementById("content").style.height = h.toString() + 'px';
    h = docs.length * 320 - 20;
    var str = document.getElementById("map").style.height;
    if ((str.substring(0,str.length-2) > 200) && docs.length > 0){
        document.getElementById("map").style.height = h.toString() + 'px';
        //map.fitBounds(bounds);
    }
    //show the map

    //for (i = 0; i < docs.length; i++) {
    //    addMapMarker(docs[i].address, i + 1);
    //}
}

function redirect(name){
    window.location = window.location.origin + ('/listing/'+name);
}

/*function gotosaved(){
    window.location = window.location.origin + '/saved';
}*/

//socket to talk to the server
//var port = "3456"; //remove later
//if (window.location.hostname === 'www.shopadoc.me'){port = "80";}
//var socket = io.connect('https://' + window.location.hostname + ":"+port ,{secure: true}); //works for localhost
//var socket = io.connect();
socket.on('connectedToServer', function (data) {
    //listDoctors(5);
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    //console.log('Searching Doctors');
    //document.getElementById('mapContainer').style.display = 'none';
    //socket.emit('searchDoctors','all');
});

/*socket.on('doctors', function(data){
    console.log("Got doctors data.... Updating List");
    console.log(data);
    listDoctors(data);
});*/



/*function searchDoctors(){
    //show loading gif
    document.getElementById("doctorContainer").innerHTML = '<div class="SaDloading"></div>';
    //document.getElementById('mapContainer').style.display = 'none';
    //document.getElementById("content").style.height = '400px';
    //querey the db
    var str = document.getElementById("searchBar").value;
    if(str !== '') {
        socket.emit('searchDoctors', str);
    }else{
        socket.emit('searchDoctors', 'all');
    }
}*/