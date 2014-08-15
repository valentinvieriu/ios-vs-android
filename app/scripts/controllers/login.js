'use strict';

angular.module('iosVsAndroidApp')
.controller('LoginCtrl', function($scope, $rootScope, $location, Facebook) {
    $rootScope.$on('fb_connected', function () {
      $location.path('/')
    });

    $scope.login = function () {
      Facebook.login().then(function(response){
        _gaq.push(['_trackEvent', 'Acquisition', 'Installed', $rootScope.config.userId, 1]);
        },
        function(response){
        _gaq.push(['_trackEvent', 'Acquisition', 'Canceled install', '', 1]);
        }
      );
    };
  });
