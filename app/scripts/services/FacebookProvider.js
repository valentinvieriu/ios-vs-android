'use strict';

angular.module('FacebookProvider',[])
  .directive('fb', function(Facebook) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="fb-root"></div>',
      compile: function(tElem, tAttrs) {
        return {
          post: function(scope, iElem, iAttrs, controller) {
            var fbAppId = iAttrs.appId || '';
            // Setup the post-load callback
            window.fbAsyncInit = function () {
              Facebook.init(fbAppId);
            };

            (function (d) {
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement('script');
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            }(document));
          }
        };
      }
    };
  })
  .factory('Facebook', function ($rootScope,$log) {

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
        "iOS"     :iOS,
        "android" :android,
        "none"    :none
      }
    }

    return {
      init:function(AppId){
        FB.init({
          appId  :AppId,
          status :true,
          cookie :true,
          xfbml  :true
        });
        // FB.getLoginStatus(function (response) {
        //     $rootScope.$broadcast("fb_statusChange", {'response': response});
        // });

        FB.Event.subscribe('auth.statusChange', function(response) {
        $rootScope.$broadcast("fb_statusChange", {'response': response});
        });

        // FB.Event.subscribe('auth.authResponseChange', function(response) {
        //     $rootScope.$broadcast("fb_statusChange", {'response': response});
        // });
      },
      getLoginStatus:function () {
          FB.getLoginStatus(function (response) {
              $rootScope.$broadcast("fb_statusChange", {'response':response});
          }, true);
      },
      login:function () {
          FB.login(function (response) {
              if (response.authResponse) {
                  $rootScope.$broadcast('fb_connected');
              } else {
                  $rootScope.$broadcast('fb_login_failed');
              }
          }, {scope:'read_stream, publish_stream, email'});
      },
      logout:function () {
          FB.logout(function (response) {
              if (response) {
                  $rootScope.$broadcast('fb_logout_succeded');
              } else {
                  $rootScope.$broadcast('fb_logout_failed');
              }
          });
      },
      unsubscribe:function () {
          FB.api("/me/permissions", "DELETE", function (response) {
              $rootScope.$broadcast('fb_logout_succeded');
          });
      },
      getFriends:function () {
          FB.api("/fql",
            {
                q:'SELECT uid, name,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.facebook_id + ') LIMIT 0,5000'

            },
            function (result) {
              $log.log(result);
              $rootScope.fb_data.friends = result.data;
              $rootScope.fb_data.buckets = _bucketFriends(result.data);
              // $rootScope.fb_data.groups = _.groupBy($rootScope.fb_data.friends, "device.os");
              $rootScope.$apply();
            });
    }
    };
});
