$(document).ready(function() {
    $('.parallax-window').parallax({imageSrc: '/images/background.jpg'});
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
        if (status == google.maps.GeocoderStatus.OK) {
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
        htmlStr += '<div class="listing">' +
                '<p>' + name +'</p>' +
                '<p>' + title +'</p>' +
                '<p>' + address + '</p>' +
                '<p>$' + minCost + '-$' + maxCost + '</p>' +
                '<p>' + starsString+ '</p>' +
                '<p>' + reviewStr + '</p>' +
                '<img style="background-image:url(' + imgurl +')"/>' + '</div>';
    }

    document.getElementById("doctorContainer").innerHTML = htmlStr;
}

//socket to talk to the server
var socket = io.connect('http://' + window.location.hostname + ":3000"); //works for localhost
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
    socket.emit('searchDoctors',str);
}