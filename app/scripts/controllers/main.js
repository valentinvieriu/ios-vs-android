'use strict';

angular.module('iosVSAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook) {

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
