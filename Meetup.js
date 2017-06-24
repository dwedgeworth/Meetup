function displayMeetUpSearch(result){
  var resultElement = '<h3>Meetup Results</h3>';
  var response = result.data;
  var markerLocations = [];

  //creates results div elements
  for (var i=0; i<response.length; i++){
    var group = response[i];
    var eventName = group.name;
    var eventDescription = group.description;
    var eventCity = group.city;
    var eventLat = group.lat;
    var eventLon = group.lon;
    var eventOrganizer = group.organizer.name;
    var location = [eventName, eventLat, eventLon]
    var markerLatLon = '{lat: ' + eventLat +', lng: ' + eventLon + '}';

    resultElement += 
    '<div class="js-group" Lat="' + eventLat + '" Lng="' + eventLon + '"><p>' + 
    'Event Name: ' + eventName + '<br>' + 
    'Event Organizer: ' + eventOrganizer + '<br>' + 
    'City: ' + eventCity + '<br>' +
    'Description: ' + eventDescription + '<br>' +
    '</p></div>';

     markerLocations.push(location);
  };
   
   //variables for GoogleMaps Creation	
  var myLatlng = new google.maps.LatLng(markerLocations[0][1], markerLocations[0][2]);
  var mapOptions = {
    zoom: 11,
    center: myLatlng,
    zoomControl:true,
    mapTypeControl: true,
    mapTypeControlOptions: {
     style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
     position: google.maps.ControlPosition.TOP_LEFT
     },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map;
   
  //create Google Map
  function initializeMap(){
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  
  var markers = []

  function addMarker(location, map) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });    
    markers.push(marker);
  };

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

  $(document).ready(function(){
    $('section').on('mouseover', '.js-group', function(event){
    event.preventDefault();
    var $Lat = Number($(this).attr("Lat"));
    var $Lng = Number($(this).attr("Lng"));
    var markerCoordinates = {lat: $Lat, lng: $Lng};
    addMarker(markerCoordinates, map);
    });

    $('section').on('mouseout', '.js-group', function(event){
    event.preventDefault();
    clearMarkers();
    });
  });

  //add resultElement
  initializeMap();
  $('.js-search-results').html(resultElement);
}

function watchFormSubmit(){
  $('.js-searchform').submit(function(event){
  	event.preventDefault();
    var userQuery = $(this).find('.js-query').val();
 
    $.ajax({
        url: 'https://api.meetup.com/find/groups?photo-host=public&page=20&key=32269d54b4474693b437c343461&text=' + userQuery,
        dataType:'jsonp',
        method:'get',
        success: displayMeetUpSearch
    }); 
  });
}

function initMap() {
  var mapCenter = {lat: 39.721192, lng: -96.621910};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: mapCenter
  });
}


$(document).ready(function(){
  watchFormSubmit();
});
