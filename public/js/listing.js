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
var socket = io.connect('http://' + window.location.hostname + ":3000"); //works for localhost
socket.on('connectedToServer', function (data) {
    console.log(data); //prints the data from the server
    socket.emit('clientConnect', 'Client Connected! - Index.js');
    socket.emit('listingDoctor',decodeURI(window.location.pathname.split('/')[2]));
});

socket.on('listingDoctor', function(data){
   console.log(data);
});
