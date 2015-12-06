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
    redirectTo: '/home'
  })

  .when('/about', {
    title: 'Page Not Found',
    templateUrl: '/static/app/templates/ng-view/about.html',
  })

  .when('/maps', {
    title: 'Page Not Found',
    templateUrl: '/static/app/templates/ng-view/maps.html',
  })

  .when('/add-place', {
    title: 'Page Not Found',
    templateUrl: '/static/app/templates/ng-view/add-place.html',
  })


  .when('/test', {
    title: 'Page Not Found',
    templateUrl: '/static/app/templates/ng-view/test.html',
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









