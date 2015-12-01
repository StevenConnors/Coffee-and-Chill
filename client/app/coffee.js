'use strict';


angular.module('coffeeAndChill', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'duScroll',
])


.config(function ($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider

    .when('/', {
      title: 'Home',
      templateUrl: '/static/app/templates/ng-view/home.html',
    })

    .when('/404', {
      title: 'Page Not Found',
      templateUrl: '/static/404.html',
    })

    .otherwise({
      redirectTo: '/404'
    });

  $locationProvider.html5Mode(true);

})

;









