'use strict';

angular.module('iosVsAndroidApp')
.controller('LoginCtrl', function($scope, $rootScope, $location, Facebook) {

    if ($rootScope.config.logged_in) {
      $location.path('/');
      $rootScope.workInProgress = true;

    } else {
      $rootScope.$on('Facebook:connected', function () {
        $location.path('/')
      });
    }
    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
      });
    };
  });
