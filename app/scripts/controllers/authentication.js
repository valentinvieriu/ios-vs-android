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

  	$scope.getLoginStatus = function(){
  		Facebook.getLoginStatus(function(response) {
  		  if(response.status === 'connected') {
  		    $rootScope.config.logged_in = true;
  		    $rootScope.$broadcast("Facebook:statusChange",response);
  		  } else {
  		    $rootScope.config.logged_in = false;
        	$location.path('/login');
  		  }
  		});
  	};

  	if (Facebook.isReady()) {
  		$scope.getLoginStatus();
  	} else {
  		$rootScope.$on("Facebook:load", function(){
  			$scope.getLoginStatus();
  		});
  	}

    // $rootScope.$on('$routeChangeStart', function(event, next, current){
    //   if ( $rootScope.config.logged_in === false && !next.access.isFree ) {
    //     $location.path('/login');
    //   };
    // });


		$rootScope.$on("Facebook:statusChange", function (event, data) {

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
						$scope.$digest();
			      break;
			  default:
			      $rootScope.config.logged_in = false;
						$scope.$digest();
			      break;
			}


		});


		$rootScope.$on("Facebook:logout", function () {
		  $rootScope.config.logged_in = false;
		  $rootScope.fb_data          = {};
		  $location.path('/login');
		});


  });
