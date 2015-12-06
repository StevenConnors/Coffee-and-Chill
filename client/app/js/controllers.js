'use strict';

angular.module('coffeeAndChill')



.controller('TopNavCtrl', function ($scope, $http) {
  $scope.getLocation = function () {
    $scope.currentLocation = "5000 Forbes Avenue, Pittsburgh, PA";
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var gMapUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.lat+","+pos.lng;
        $http.get(gMapUrl).success(function (response) {
          console.log(response.results[0].formatted_address);
          $scope.currentLocation = response.results[0].formatted_address;
        });
      }, function() {
        console.log("error");
      });
    } else {
      // Browser doesn't support Geolocation, default to CMU 
      console.log("Broweser does not supprt geolocation");
      var pos = {
        lat: 40.443589,
        lng: -79.943556
      };
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    }
  }
})


// Handles the highlighting of the side bar navigations
.controller('SideNavCtrl', function ($scope, $location) {
  $scope.isActive = function(route) {
    return route === $location.path();
  };
})


// Handles the highlighting of the side bar navigations
.controller('AddPlaceCtrl', function ($scope, $location, $http) {

  //TODO concurrency issues. Fix call back
  $scope.submit = function () {
    console.log("Submitting from Add Place Ctrl");
    $http.post('/places/create', {
      place: $scope.place,
      description: $scope.description,
      lat: $scope.lat,
      lng: $scope.lng,
      crowdedness: $scope.crowdedness,
      basement_floors: $scope.basement_floors,
      floors: $scope.floors,
      isBuilding: true,
    });

    // Create the floors. Starting from top
    var horzShift = 0.0005;
    for (var i = 0; i < $scope.floors; i++) {
      $http.post('/floor/create', {
        place: $scope.place,
        description: $scope.description,
        lat: $scope.lat,
        lng: $scope.lng + horzShift * (i + 1),
        floors: -1,
        basement_floors: -1,
        isBuilding: false,
        whichFloor: (i+1),
        crowdedness: $scope.crowdedness,
      });
    }
    var basementLetters = "ABCDEFGHJI";
    for (var i = 0; i < $scope.basement_floors; i++) {
      $http.post('/floor/create', {
        place: $scope.place,
        description: $scope.description,
        lat: $scope.lat,
        lng: $scope.lng - horzShift * (i + 1),
        floors: -1,
        basement_floors: -1,
        isBuilding: false,
        whichFloor: basementLetters[i],
        crowdedness: $scope.crowdedness,
      });
    }
    $location.path('/maps'); 
  }

})



.controller('MapCtrl', function ($scope, $compile, $timeout, $http) {
  $scope.init = function() {
    console.log("Init function");
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Retrieve information about various places.
        var places = [];
        $http.get('/places/all')
        .then(function (response) {
          places = response.data;

        // Set map characteristics
        var mapOptions = {
          zoom: 17,
          center: new google.maps.LatLng(pos.lat, pos.lng),
        };
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        // Create variable for the markers
        $scope.buildingMarkers = [];

        $scope.floorMarkers = [];

        // Letters for the basement
        $scope.basementLetters = "ABCDEFGHJI";



        // Create the text window when clicked on marker.
        $scope.infoWindow = new google.maps.InfoWindow();

        // Focus variable to keep track of which marker has the focus
        $scope.focus = -1;

        // Variable to keep track of the number of places on the map
        $scope.placeCount = 0;
        // Create markers from the data retrieved from back end.
        for (var i = 0; i < places.length; i++){
          createMarker(places[i]);
        }
      }) // .then function
      ; // $http methods
      });
    } else {
      // Browser doesn't support Geolocation, default to CMU 
      console.log("Broweser does not supprt geolocation");
      var pos = {
        lat: 40.443589,
        lng: -79.943556
      };
      alert("Please update your browser to support geolocation");
    }
  }

  var createMarker = function (place) {
    var marker = initMarker(place);
    setMarkerEventListener(place, marker);
    // Add this marker into the global markers
    if (place.isBuilding) {
      $scope.placeCount += 1;
      $scope.buildingMarkers.push(marker);
    } else {
      // Get the marker's parent's name and match that to the index of the 2d array
      $scope.floorMarkers.push(marker);
    }
  }  

  var initMarker = function (place) {
    // Case on the crowdedness to determine icon
    var markerLabel = "";
    if (!place.isBuilding) {
      markerLabel = place.whichFloor.toString();
    }

    var marker = new google.maps.Marker({
      index: $scope.buildingMarkers.length, 
      map: $scope.map,
      label: markerLabel,
      position: new google.maps.LatLng(place.lat, place.lng),
      title: place.place,
      // index: $scope.placeCount,

      // Below are properties of the place
      basement_floors: place.basement_floors,
      floors: place.floors,
      isBuilding: place.isBuilding,
      crowdedness: place.crowdedness,
    });

    if (place.isBuilding) {
      marker.content = '<div class="infoWindowContent">' + place.description + '</div>';
    } else {
      switch(place.crowdedness) {
        case -1:
          marker.content = '<div><h3 style="color:gray;">' + "This is floor " + place.whichFloor + '<br></h3></div>';
          marker.content += "<div> - There are no places available to study here.</div>";
          break;
        case 0:
          marker.content = '<div><h3 style="color:green;">' + "This is floor " + place.whichFloor + '<br></h3></div>';
          marker.content += "<div> - This place has many seats available to study.</div>";
          break;
        case 1:
          marker.content = '<div><h3 style="color:yellow;">' + "This is floor " + place.whichFloor + '<br></h3></div>';
          marker.content += "<div> - This place has a few seats left to study.</div>";
          break;
        case 2:
          marker.content = '<div><h3 style="color:red;">' + "This is floor " + place.whichFloor + '<br></h3></div>';
          marker.content += "<div> - This place has no seats available to study.</div>";
          break;
        default:
          console.log("ERROR: Invalid place.popuarlity value");
          console.log(place.crowdedness);
      }
    }
    return marker;
  }

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
        $scope.infoWindow.close();
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

      // Open infoWindow box
      var content = '<div><h2>' + marker.title + '</h2></div>' + marker.content;
      var compiled = $compile(content)($scope);
      $scope.$apply();
      $scope.$evalAsync(function() {
        var cnt = "";
        for (var i = 0; i < compiled.length; i++) {
          cnt += compiled[i].innerHTML;
        }
        $scope.infoWindow.setContent(cnt);
        $scope.infoWindow.open($scope.map, marker);          
      });



      // Create the markers for each floor in the building.
      $http.get('/floor/' + marker.title).then(function (response) {
        console.log("Getting floor by its owner title");
        // console.log(response.data);
        var horzShift = 0.0005;

        for (var i = 0; i < response.data.length; i++) {
          var floor = response.data[i];
          createMarker(floor);
        }
      });




   });
  }

  
  $scope.submit = function (title, index, isBasement, crowdedness) {
    console.log("controllers.submit");

    $http.post("/floor/update", {
      title: title,
      index: index,
      isBasement: isBasement,
      crowdedness, crowdedness
    });
  }

  var objectIsInList = function (obj, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  // //TODO concurrency issues
  // $scope.createRandomPlace = function () {
  //   var place = "Hunt Library";
  //   var description = "CS Majors";
  //   var lat = 40.443830;
  //   var lng = -79.944539;
  //   var basement_floors = 2;
  //   var floors = 2;

  //   console.log("createRandomPlace");
  //   $http.post('/places/create', {
  //     place: place,
  //     description: description,
  //     lat: lat,
  //     lng: lng,
  //     crowdedness: 2,
  //     basement_floors: basement_floors,
  //     floors: floors,
  //     isBuilding: true,
  //   });

  //   console.log(place);

  //   console.log("created place");
  //   // Create the floors. Starting from top
  //   var horzShift = 0.0005;
  //   for (var i = 0; i < floors; i++) {
  //     $http.post('/floor/create', {
  //       place: place,
  //       description: description,
  //       lat: lat,
  //       lng: lng + horzShift * (i + 1),
  //       crowdedness: -1,
  //       floors: -1,
  //       basement_floors: -1,
  //       isBuilding: false,
  //       whichFloor: (i+1),
  //     });
  //   }
  //   var basementLetters = "ABCDEFGHJI";
  //   for (var i = 0; i < basement_floors; i++) {
  //     $http.post('/floor/create', {
  //       place: place,
  //       description: description,
  //       lat: lat,
  //       lng: lng - horzShift * (i + 1),
  //       crowdedness: -1,
  //       floors: -1,
  //       basement_floors: -1,
  //       isBuilding: false,
  //       whichFloor: basementLetters[i],
  //     });
  //   }
  //   console.log("created floors");
  //   console.log("Done");
  // }

  $scope.getAllPlaces = function () {
    $http.get('/places/all').success(function (response) {
      console.log(response);
    });
    $http.get('/floor/all').success(function (response) {
      console.log(response);
    });
  }

  // Below is code for more UI oriented stuff

  $scope.makeRange = function (num) { 
    return new Array(num);
  }

  $scope.showFloor = [];
  $scope.showFloorUpdates = [];
  $scope.showBasementUpdates = [];

  // This is for the text at the bottom of the map. If that's clicked, trigger an event on the pins.
  $scope.openInfoWindowAndTriggerDetails = function(e, selectedMarker, index){
    google.maps.event.trigger(selectedMarker, 'click');

    $scope.showFloor[index] = !$scope.showFloor[index];
  }

  $scope.triggerFloorDetails = function(index){
    $scope.showFloorUpdates[index] = !$scope.showFloorUpdates[index];
  }

  $scope.triggerBasementDetails = function(index){
    console.log(index);
    console.log($scope.showBasementUpdates[index]);
    $scope.showBasementUpdates[index] = !$scope.showBasementUpdates[index];
  }




})

;


