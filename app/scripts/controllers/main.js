'use strict';

angular.module('iosVSAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook) {

  // button functions
  $scope.getLoginStatus = function () {
      Facebook.getLoginStatus();
  };

  $scope.logout = function () {
      Facebook.logout();
  };

  $scope.unsubscribe = function () {
      Facebook.unsubscribe();
  };

  $scope.appRequest = function () {
      Facebook.ui({
        method:'apprequests',
        message:'Try a cool Facebook application that tells you what type of smart phone your friends use.'
      });
  };

  $scope.share = function () {
    Facebook.classicShare('http://ios-vs-android.herokuapp.com/');
  };

});
