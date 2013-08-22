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
  .factory('Facebook', function ($rootScope) {
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
          FB.api(
            {
                method:'fql.multiquery',
                queries:{
                    'q1':'SELECT uid, name, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.facebook_id + ') LIMIT 0,5000',
                    'q2':'SELECT url FROM profile_pic WHERE width=800 AND height=800 AND id = ' + $rootScope.facebook_id
                }
            },
            function (data) {
                //let's built the data to send to php in order to create our new user
                $rootScope.fb_data.friends = data[0].fql_result_set;
                $rootScope.fb_data.picture = data[1].fql_result_set[0].url;
                $rootScope.$apply();
            });
    }
    };
});
