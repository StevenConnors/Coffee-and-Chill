angular.module('coffeeAndChill')

.directive("googleMaps", function () {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/google-maps.html",
	};
})

.directive("sideNavBar", function () {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/side-nav-bar.html",
	};
})

.directive("topNavBar", function () {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/top-nav-bar.html",
	};
})

.directive("infoBoxText", function () {
	return {
		restrict: "E",
		templateUrl: "/static/app/templates/directives/info-box-text.html"
	}
})

;



