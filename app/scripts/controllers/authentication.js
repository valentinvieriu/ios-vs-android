'use strict';

/**
 * @ngdoc function
 * @name iosVsAndroidApp.controller:AuthenticationCtrl
 * @description
 * # AuthenticationCtrl
 * Controller of the iosVsAndroidApp
 */
angular.module('iosVsAndroidApp')
  .controller('AuthenticationCtrl', function ($scope, $rootScope, $location, Facebook) {
    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
      });
    };

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $rootScope.config.logged_in = true;
          $rootScope.$broadcast("Facebook:statusChange",response);
        } else {
          $rootScope.config.logged_in = false;
        }
      });
    };

    $scope.$watch(function() {
      // This is for convenience, to notify if Facebook is loaded and ready to go.
      return Facebook.isReady();
    }, function(newVal) {
      // You might want to use this to disable/show/hide buttons and else
      $scope.facebookReady = true;
      $scope.getLoginStatus();
    });


    $rootScope.$on('$routeChangeStart', function(event, next, current){
      if ( $rootScope.config.logged_in === false && !next.access.isFree ) {
        $location.path('/login');
      };
    });


	$scope.$on("Facebook:statusChange", function (event, data) {
		// console.log(data);

		switch (data.status) {
		  case 'connected':
		      $rootScope.config.fb_status = data.status;
		      $rootScope.config.userId    = data.authResponse.userID;
		      $rootScope.config.logged_in = true;
		      $rootScope.$broadcast("Facebook:connected");
		      break;
		  case 'not_authorized' || 'unknown':
		      $rootScope.config.fb_status = data.status;
		      $rootScope.config.logged_in = false;
		      break;
		  default:
		      $rootScope.config.logged_in = false;
		      break;
		}

		$scope.$apply();

	});


	$rootScope.$on("Facebook:logout", function () {
	  $rootScope.config.logged_in = false;
	  $rootScope.fb_data          = {};
	  $location.path('/login');
	});

	
  });
