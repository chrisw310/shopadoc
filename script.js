$(document).ready(function() {
    $('.parallax-window').parallax({imageSrc: '/images/background.jpg'});
});



var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -27.469, lng: 153.025},
          zoom: 12
        });
      }