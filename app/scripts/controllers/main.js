'use strict';

angular.module('iosVsAndroidApp')
.controller('MainCtrl', function($scope, $rootScope, Facebook, processData, fbData) {
  
  $scope.fb_data = {};

  $scope.uninstall = function () {
      FB.api("/me/permissions", "DELETE", function (response) {
          $rootScope.$broadcast('Facebook:logout');
      });
  };

  $scope.appRequest = function () {
      Facebook.ui({
        method:'apprequests',
        message:'Try a cool Facebook application that tells you what type of smart phone your friends use.'
      });
  };


  $rootScope.$on("Facebook:connected", function () {
    var query1 = 'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000';
    Facebook.api("/fql",{ q:query1 },function(result){
      fbData                    = processData.bucketFriends(result.data);
      $scope.fb_data            = fbData;
      $rootScope.workInProgress = false;
    });

    var query2 = 'SELECT uid,pic_square, devices FROM user WHERE uid = '+ $rootScope.config.userId;
    Facebook.api("/fql",{ q:query2 }, function(result){
      $scope.fb_data.userData = result.data;
    });
  });

});
