'use strict';

angular.module('yoApp')
  .controller('MainCtrl', function (Facebook, $scope, $rootScope, $http, $location) {

    // if ( $rootScope.logged_in == false ) {
    //   $location.path('/login');
    // }

    // button functions
    $scope.getLoginStatus = function () {
        Facebook.getLoginStatus();
    };

    $scope.login = function () {
        Facebook.login();
    };

    $scope.logout = function () {
        Facebook.logout();
    };

    $scope.unsubscribe = function () {
        Facebook.unsubscribe();
    }
});
