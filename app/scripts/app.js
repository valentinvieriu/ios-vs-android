'use strict';
angular.module('iosVSAndroidApp', ['FacebookProvider','ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        access:{
          isFree:false
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access:{
          isFree:true
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })

.run(function (Facebook, $rootScope, $location) {
    $rootScope.logged_in = false;
    $rootScope.fb_data   = {};
    $rootScope.$on('$routeChangeStart', function(event, next, current){
      if ( $rootScope.logged_in === false && !next.access.isFree ) {
        $location.path('/login');
      };
    });
    $rootScope.$on("fb_statusChange", function (event, args) {
      console.log(args);

      switch (args.response.status) {
        case 'connected':
            $rootScope.fb_status   = args.response.status;
            $rootScope.facebook_id = args.response.authResponse.userID;
            $rootScope.logged_in   = true;
            $rootScope.$broadcast('fb_connected');
            break;
        case 'not_authorized' || 'unknown':
            $rootScope.fb_status = args.response.status;
            $rootScope.logged_in = false;
            break;
        default:
            $rootScope.logged_in = false;
            break;
      }

      $rootScope.$apply();

    });

    $rootScope.$on('fb_login_failed', function () {
      console.log('fb_login_failed');
    });
    $rootScope.$on('fb_logout_succeded', function () {
      console.log('fb_logout_succeded');
      $rootScope.logged_in = false;
      $rootScope.fb_data = {};
      $location.path('/login');
    });
    $rootScope.$on('fb_logout_failed', function () {
      console.log('fb_logout_failed!');
    });

    $rootScope.$on('fb_connected', function () {
      Facebook.getFriends();
    });

});