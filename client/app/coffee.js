'use strict';


angular.module('coffeeAndChill', [
  'coffeeService',
  'ngRoute',
  ])


.config(function ($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider

    .when('/', {
      redirectTo: '/home'
    })

    .when('/about', {
      title: 'Page Not Found',
      templateUrl: '/static/app/templates/ng-view/about.html',
    })

    .when('/home', {
      title: 'Page Not Found',
      templateUrl: '/static/app/templates/ng-view/home.html',
    })

    .when('/test', {
      title: 'Page Not Found',
      templateUrl: '/static/app/templates/ng-view/test.html',
    })

    .when('/404', {
      title: 'Page Not Found',
      templateUrl: '/static/404.html',
    })

    // Test to show nothing
    .when('/405', {
    })

    .otherwise({
      redirectTo: '/404'
    });

  $locationProvider.html5Mode(true);

})

;









