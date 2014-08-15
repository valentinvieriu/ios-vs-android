'use strict';
angular.module('iosVsAndroidApp', ['FacebookProvider','ngRoute'])
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

.run(function (Facebook, Parallax, processData, fbData, $rootScope, $location, $log) {
    $rootScope.config           = $rootScope.config || {};
    $rootScope.fb_data          = $rootScope.fb_data || {};
    $rootScope.config.logged_in = false;
    $rootScope.workInProgress   = true;
    $rootScope.$on('$routeChangeStart', function(event, next, current){
      if ( $rootScope.config.logged_in === false && !next.access.isFree ) {
        $location.path('/login');
      };
    });
    $rootScope.$on("fb_statusChange", function (event, args) {
      // $log.log(args);

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

  $rootScope.$on('fb_connected', function () {
    var query1 = 'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000';
    Facebook.getFql(query1).then(function(result){
      fbData                    = processData.bucketFriends(result.data);
      $rootScope.fb_data        = fbData;
      $rootScope.workInProgress = false;
    });

    var query2 = 'SELECT uid,pic_square, devices FROM user WHERE uid = '+ $rootScope.config.userId;
    Facebook.getFql(query2).then(function(result){
      // fbData.userData         = result.data;
      $rootScope.fb_data.userData = result.data;
    });
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

});