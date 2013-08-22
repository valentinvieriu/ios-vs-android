'use strict';

angular.module('iosVSAndroidApp')
.controller('LoginCtrl', function($scope, $rootScope, $location, Facebook) {
    $rootScope.$on('fb_connected', function () {
      $location.path('/')
    });

    $scope.login = function () {
      Facebook.login();
    };
  });
