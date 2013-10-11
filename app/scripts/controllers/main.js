'use strict';

angular.module('iosVSAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook, $log, fbData) {
  $scope.fb_data  = fbData;
  $scope.title = "Analyzing your network ...";
  $scope.workInProgress = true;

  var findWinner = function findWinner(){
      var title = "Impressive, ##% of your friends use ";
      var ios = Math.floor($scope.fb_data.iOS / $scope.fb_data.total * 100);
      var android = Math.floor($scope.fb_data.android / $scope.fb_data.total * 100);
      if (ios == android) {
        title = "Incredible, you have a balanced network! "
      }
      else if (ios > android){
        title = title.replace("##",ios);
        title = title + "iOS!";
      }
      else {
        title = title.replace("##",android);
        title = title + "Android!";
      }
      $scope.title = title ;
  };
  var _bucketFriends = function _bucketFriends(data){
      var iOS     =[];
      var android =[];
      var none    =[];
      var result  ={};
      console.time("_bucketFriends");
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

      $scope.fb_data.iOS     = iOS.length;
      $scope.fb_data.android = android.length;
      $scope.fb_data.none    = none.length;
      $scope.fb_data.total   = data.length;
      result = {
        "iOS"     :iOS,
        "android" :android,
        "none"    :none
      };
      console.timeEnd("_bucketFriends");
      findWinner();
      $scope.workInProgress  = false;
      return result;
    }

  console.time("getFql");
  var query = 'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000';
  Facebook.getFql(query).then(function(result){
      console.timeEnd("getFql");
      var friends    = _.sortBy(result.data, function(el) {return -el.mutual_friend_count});
      var buckets    = _bucketFriends(friends);
      fbData.buckets = buckets;
      fbData.friends = friends;
      $scope.fb_data = fbData;
  });

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
    var wall_post_message = {
      method      : 'feed',
      link        : 'https://apps.facebook.com/ios_vs_android',
      picture     : 'http://ios-vs-android.herokuapp.com/img/wall'+Math.floor(Math.random()*9) +'.jpeg',
      name        : 'See if your friends are using iOS or Android.',
      caption     : '',
      description : 'Try a cool Facebook application that tells you what type of smart phone your friends use.',
      properties: {
        "generated using": {
          "text" : "iOS vs Android",
          "href" : "https://apps.facebook.com/ios_vs_android"
        }
      }
    };
    Facebook.ui(wall_post_message);
  };

});
