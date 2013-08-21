'use strict';

angular.module('yoApp')
  .controller('LoginCtrl', function(Facebook, $scope, $rootScope, $http, $location) {
    $rootScope.$on('fb_connected', function () {
      $location.path('/')
    });

    $scope.login = function () {
      Facebook.login();
    };
  });
