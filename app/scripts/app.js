'use strict';
angular.module('iosVsAndroidApp', ['facebook','ngRoute'])
.config(function ($routeProvider, $locationProvider, FacebookProvider) {
  // $locationProvider.html5Mode(true);
  FacebookProvider.init('390729450981027');
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      access:{
        isFree:false
      }
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      access:{
        isFree:true
      }
    })
    .otherwise({
      redirectTo: '/'
    });

  })

.run(function ($rootScope) {
  $rootScope.config           = $rootScope.config || {};
  $rootScope.config.logged_in = false;
  $rootScope.workInProgress   = true;

});