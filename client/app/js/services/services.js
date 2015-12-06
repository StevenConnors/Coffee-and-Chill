'use strict';

var app = angular.module( 'coffeeService' , []);

app.factory('Map', function( $rootScope , $compile ){

	var canvas   = document.getElementById('map');

	return {
		init:function( map_data , scope ) {
      // var user_data = map_data.user.defaults,
      // locations = map_data.locations,
      var locations = map_data;

      var mapOptions = {
      	zoom: 17,
      	center: new google.maps.LatLng(40.443504, -79.9415),
      }

      var Map = $rootScope.map = new google.maps.Map(canvas, mapOptions);

      scope.markers = [];

      for (var count = locations.length, i = 0; i < count; i++ ) {
      	var latLng  = locations[i];

      	var marker = new google.maps.Marker({
      		position: new google.maps.LatLng(latLng[0], latLng[1]),
      		map:      Map,
      		title:    '('+latLng[0]+","+latLng[1]+')',
      		markerId: i,
        }); //marker

        var infowindow = new google.maps.InfoWindow(); //infowindow
        scope.markers[i] = {};
        scope.markers[i].locations = [latLng[0] ,latLng[1]];
        
        google.maps.event.addListener(marker, 'click', function (){
      		console.log(marker.title);
      		var content = '<div ng-include src="\'./../../templates/ng-view/test.html\'"></div>';
      		scope.latLng = scope.markers[marker.markerId].locations;
      		var compiled = $compile(content)(scope);
      		scope.$apply();
      		infowindow.setContent(compiled[0].innerHTML);
      		infowindow.open(Map , marker);
      	}
        );        









        // console.log(scope.markers[i]);

      }//for()
    }//init
  };//return

});//