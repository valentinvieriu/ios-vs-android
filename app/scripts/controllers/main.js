'use strict';

angular.module('iosVSAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook, $log, $debounce) {

  var applyQuery = function applyQuery() {
      $scope.filter = {
        query : $scope.searchFriend
      };
  };

  var _bucketFriends = function _bucketFriends(data){
      var iOS     =[];
      var android =[];
      var none    =[];
      angular.forEach(data, function(el, key){
        var _el       = el;
        var iOS_count = 0;
        var devicesCount = el.devices.length;
        if (devicesCount == 0) {
          delete(_el.devices);
          none.push(_el);
        }
        else {
          angular.forEach(el.devices, function(device, key){

            if (device.os == 'iOS') {

              if (iOS_count < 1) {
                delete(_el.devices);
                iOS.push(_el);
              }

              iOS_count ++ ;
            }
            else {
              delete(_el.devices);
              android.push(_el);
            }
          })
        }
      });


      return {
        "iOS"     :_.sortBy(iOS, function(el) {return -el.mutual_friend_count}),
        "android" :_.sortBy(android, function(el) {return -el.mutual_friend_count}),
        "none"    :_.sortBy(none, function(el) {return -el.mutual_friend_count})
      }
    }
    console.time("getFql");
    var query = 'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000';
    Facebook.getFql(query).then(function(result){
        console.timeEnd("getFql");

        $rootScope.fb_data.buckets = _bucketFriends(result.data);
    });

    $scope.$watch('searchFriend', function(newValue, oldValue) {
        if (newValue === oldValue) { return; }
        $debounce(applyQuery, 350);
    },true);

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
