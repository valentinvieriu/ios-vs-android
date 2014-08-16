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

  $scope.$watch(
    function(){
      return $rootScope.config.logged_in
    },
    function(newVal) {
      if (newVal){
        //Get the list of friends
        Facebook.api("/fql",{ 
            q:'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000' 
          },
          function(result){
            fbData                    = processData.bucketFriends(result.data);
            $scope.fb_data            = fbData;
            $rootScope.workInProgress = false;
          });

        //get user profile
        Facebook.api("/fql",{ 
            q:'SELECT uid,pic_square, devices FROM user WHERE uid = '+ $rootScope.config.userId
          },
          function(result){
            $scope.fb_data.userData = result.data;
          });
      }
    }
  );


});
