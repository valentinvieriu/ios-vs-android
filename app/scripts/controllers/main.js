'use strict';

angular.module('iosVSAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook, $log) {

    // if ( $rootScope.logged_in == false ) {
    //   $location.path('/login');
    // }

    function _bucketFriends(data){
      var iOS     =[];
      var android =[];
      var none    =[];
      angular.forEach(data, function(el, key){
        var _el       = el;
        var iOS_count = 0;
        if ( el.devices.length > 0 ) {
          angular.forEach(el.devices, function(device, key){
            if (device.os == 'iOS') {

              if (iOS_count < 1) {
                iOS.push(_el);
              }

              iOS_count ++ ;
            }
            else {
              android.push(_el);
            }
          })

        }
        else {
          none.push(el);
        }
      });

      return {
        "iOS"     :_.sortBy(iOS, function(el) {return -el.mutual_friend_count}),
        "android" :_.sortBy(android, function(el) {return -el.mutual_friend_count}),
        "none"    :_.sortBy(none, function(el) {return -el.mutual_friend_count})
      }
    }

    var query = 'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000';
    Facebook.getFql(query).then(function(result){
        $rootScope.fb_data.buckets = _bucketFriends(result.data);
        // $log.log(data);
    });


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
