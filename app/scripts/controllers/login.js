'use strict';

angular.module('iosVsAndroidApp')
.controller('LoginCtrl', function($scope, $rootScope, $location, Facebook) {
    $rootScope.$on('Facebook:connected', function () {
      $location.path('/')
    });
  });
