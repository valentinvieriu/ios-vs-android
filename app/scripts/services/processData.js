'use strict';

angular.module('iosVSAndroidApp')
  .factory('processData', function ($rootScope, Facebook) {
    function bucketFriends(data){
      var iOS     =[];
      var android =[];
      var none    =[];
      var buckets ={};
      var count   ={};
      var friends = _.sortBy(data, function(el) {return -el.mutual_friend_count});

      angular.forEach(friends, function(el, key){
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
      count = {
        iOS     : iOS.length,
        android : android.length,
        none    : none.length,
        total   : data.length
      };

      buckets = {
        "iOS"     :iOS,
        "android" :android,
        "none"    :none
      };

      return {
        buckets : buckets,
        friends : friends,
        count   : count
      };
    };
    return {
      bucketFriends: bucketFriends
    };
  });
