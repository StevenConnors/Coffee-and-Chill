


angular.module('coffeeAndChill')



.directive("meshNavBar", [ "$location", function ($location) {

	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/mesh-nav-bar.html",
	};
}])

.directive("createNewOrgStart", [ "$location", function ($location) {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/create-new-org-start.html",
	};
}])


.directive("googleMaps", function () {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/google-maps.html",
	};
})


.directive("infoBoxText", function () {
	return {
		restrict: "E",
		scope: {
			marker: "=marker"
		},
		templateUrl: "/static/app/templates/directives/info-box-text.html",
	}
})



;



