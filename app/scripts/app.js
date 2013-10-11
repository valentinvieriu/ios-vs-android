'use strict';
angular.module('iosVSAndroidApp', ['FacebookProvider','ngRoute','pasvaz.bindonce'])
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

.run(function (Facebook, $rootScope, $location, $log) {
    var scene = document.getElementById('scene');
    var parallax = new Parallax(scene);

    // $('#scene').parallax();
    $rootScope.config           = $rootScope.config || {};

    $rootScope.config.logged_in = false;
    $rootScope.$on('$routeChangeStart', function(event, next, current){
      if ( $rootScope.config.logged_in === false && !next.access.isFree ) {
        $location.path('/login');
      };
    });
    $rootScope.$on("fb_statusChange", function (event, args) {
      $log.log(args);

      switch (args.response.status) {
        case 'connected':
            $rootScope.config.fb_status = args.response.status;
            $rootScope.config.userId    = args.response.authResponse.userID;
            $rootScope.config.logged_in = true;
            $rootScope.$broadcast('fb_connected');
            break;
        case 'not_authorized' || 'unknown':
            $rootScope.config.fb_status = args.response.status;
            $rootScope.config.logged_in = false;
            break;
        default:
            $rootScope.config.logged_in = false;
            break;
      }

      $rootScope.$apply();

    });

    $rootScope.$on('fb_login_failed', function () {
      $log.log('fb_login_failed');
    });
    $rootScope.$on('fb_logout_succeded', function () {
      $rootScope.config.logged_in = false;
      $rootScope.fb_data          = {};
      $log.log('fb_logout_succeded');
      $location.path('/login');
    });
    $rootScope.$on('fb_logout_failed', function () {
      $log.log('fb_logout_failed!');
    });

    $rootScope.$on('fb_connected', function () {
      var query = 'SELECT uid,pic_square, devices FROM user WHERE uid = '+ $rootScope.config.userId;
      Facebook.getFql(query);
    });

});