'use strict';

angular.module('coffeeAndChill')


.controller('TopNavCtrl', function ($scope) {
  $scope.currentLocation = "500000 Forbes Avenue, Pittsburgh, PA";
  // TODO: Get a method which retrieves user's current location
})

// Handles the highlighting of the side bar navigations
.controller('SideNavCtrl', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    };
})


.controller('MapCtrl', function ($scope) {
  // Retrieve information about various places.
  var places = [
  {
    place : 'Cohon University Center',
    description : 'This is the best place in the world!',
    lat : 40.443504,
    lng : -79.9415,
    popularity: 0,
    basement_floors: 1,
    floors: 3,
    isBuilding: true,
  },
  {
    place : 'Hunt Library',
    description : 'This place is aiiiiite!',
    lat : 40.441085,
    lng : -79.943722,
    popularity: 1,
    basement_floors: 1,
    floors: 5,
    isBuilding: true,
  },
  {
    place : 'Doherty Hall',
    description : 'This is the second best place in the world!',
    lat : 40.442540,
    lng : -79.944168,
    popularity: 2,
    basement_floors: 4,
    floors: 4,
    isBuilding: true,
  },
  ];

  // Set map characteristics
  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(40.443504, -79.9415),
  }
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // Create variable for the markers
  $scope.floorMarkers = [];
  $scope.buildingMarkers = [];

  // Create the text window when clicked on marker.
  var infoWindow = new google.maps.InfoWindow();

  // Focus variable to keep track of which marker has the focus
  $scope.focus = -1;


  var setMarker = function (place) {
    // Case on the popularity to determine icon

    var red = {
      url: 'red.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(48, 48),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 48)
    };

    var marker = new google.maps.Marker({
      index : $scope.buildingMarkers.length,

      map: $scope.map,
      position: new google.maps.LatLng(place.lat, place.lng),
      title: place.place,
      // icon: red,
      // Icon not working
    });
    if (place.isBuilding) {
      marker.content = '<div class="infoWindowContent">' + place.description + '</div>';
    } else {
      marker.content = '<div class="infoWindowContent">' + "This is floor " + place.whichFloor + '</div>';
      marker.content += '<div>';
      marker.content += '<a href="404">404</a><br>';
      marker.content += '<a href="about">About</a><br>';
      marker.content += '<a href="home">Home</a><br>';
      marker.content += '<a href="test">TEST</a><br>';
      marker.content += '</div>';

    }
    return marker;
  }

  $scope.submit = function () {
    console.log("USER SUBMITTED");
  };

  var submit = function () {
    console.log("USER asdf");
  };

  var setMarkerEventListener = function (place, marker) {
    // Event listener for onclick
    google.maps.event.addListener(marker, 'click', function() {
      // If the click is not on the current focus or its floors, then redraw.
      // If object is the building's initial marker 
      if (marker === $scope.buildingMarkers[$scope.focus]) {
        // Clear the floor icons;
        for (var i = 0; i < $scope.floorMarkers.length; i++) {
          $scope.floorMarkers[i].setMap(null);
        }
        $scope.floorMarkers = [];
        // clear $scope.focus
        $scope.focus = -1;

        // Close InfoWindow
        infoWindow.close();
        return;
      } else {
        // Update $scope.focus
        $scope.focus = marker.index;
      } 

      if (!objectIsInList(marker, $scope.floorMarkers)) {
        // Redraw the canvas to only have the main markers.
        // Thus, nullify the and clear the array of floorMarkers
        for (var i = 0; i < $scope.floorMarkers.length; i++) {
          $scope.floorMarkers[i].setMap(null);
        }
        $scope.floorMarkers = [];
        for (var i = 0; i < $scope.buildingMarkers.length; i++) {
          $scope.buildingMarkers[i].setMap($scope.map);
        } 
      }

      // This directive isn't working.
      // var content = '<info-box-text info="marker"></info-box-text>';
      
      // Open infoWindow box
      var content = '<h2>' + marker.title + '</h2>' + marker.content;
      infoWindow.setContent(content);
      infoWindow.open($scope.map, marker);

      
      // Create the markers for each floor in the building.
      var horzShift = 0.0005;
      for (var i = 0; i < place.floors; i++) {
        var floorAbove = {
          place: place.place,
          description: place.description,
          lat: place.lat,
          lng: place.lng + horzShift * (i + 1),
          popularity: 3,
          floors: -1,
          basement_floors: -1,
          isBuilding: false,
          whichFloor: (i+1),
        }
        createMarker(floorAbove);
      }
      var basementLetters = "ABCDEFGHJI";
      for (var i = 0; i < place.basement_floors; i++) {
        var floorBelow = {
          place: place.place,
          description: place.description,
          lat: place.lat,
          lng: place.lng - horzShift * (i + 1),
          popularity: 3,
          floors: -1,
          basement_floors: -1,
          isBuilding: false,
          whichFloor: basementLetters[i],
        }
        createMarker(floorBelow);
      }
    });
}

var createMarker = function (place){
  var marker = setMarker(place);
  setMarkerEventListener(place, marker);
    // Add this marker into the global markers
    if (place.isBuilding) {
      $scope.buildingMarkers.push(marker);
    } else {
      $scope.floorMarkers.push(marker);
    }
  }  

  var objectIsInList = function (obj, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  // This is for the text at the bottom of the map. If that's clicked, trigger an event on the pins.
  $scope.openInfoWindow = function(e, selectedMarker){
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  }

  // Create markers from the data retrieved from back end.
  for (var i = 0; i < places.length; i++){
    createMarker(places[i]);
  }
})

;


