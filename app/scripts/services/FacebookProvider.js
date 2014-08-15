'use strict';

angular.module('FacebookProvider',[])
  .directive('fb', function(Facebook) {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="fb-root"></div>',
      controller: function($scope,$rootScope){
        this.setAppId = function(appId){
          $rootScope.config       = $rootScope.config || {};
          $rootScope.config.appId = appId;
        }
      },
      compile: function(tElem, tAttrs) {
        return {
          post: function(scope, iElem, iAttrs, controller) {
            var fbAppId = iAttrs.appId || '';

            controller.setAppId(fbAppId);

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
  .directive('fbFacepile', function () {
    return {
      template : '<iframe scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:600px;" allowTransparency="true"></iframe>',
      restrict : 'E',
      replace  : true,
      link: function postLink(scope, element, attrs) {
        var fbUrl    = '//www.facebook.com/plugins/facepile.php?colorscheme=light&show_count=true';
        var app_id   = '&app_id=' + attrs.appId;
        var width    = '&width=' + (attrs.width || 600);
        var size     = '&size=' + (attrs.size || 'large');
        var max_rows = '&max_rows=' + (attrs.max_rows || '1');

        fbUrl = fbUrl + app_id + width + size + max_rows;
        element.attr('src',fbUrl);
      }
    }
  })
  .factory('Facebook', function ($rootScope, $log, $q, _ ) {
    return {
      init:function(appId){
        FB.init({
          appId  :appId,
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
      login:function (_scope) {
        var deferred = $q.defer();
        var scope = _scope || '';

        FB.login(function (response) {
            if (response.authResponse) {
                $rootScope.$broadcast('fb_connected');
                deferred.resolve(response);
            } else {
                $rootScope.$broadcast('fb_login_failed');
                deferred.reject(response);
            }

        }, {scope:scope});
        return deferred.promise;
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
                q:'SELECT uid, name,mutual_friend_count,pic_square, devices FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = '+ $rootScope.config.userId + ') LIMIT 0,5000'

            },
            function (result) {
              $log.log(result);
              $rootScope.fb_data.friends = result.data;
              $rootScope.fb_data.buckets = _bucketFriends(result.data);
              // $rootScope.fb_data.groups = _.groupBy($rootScope.fb_data.friends, "device.os");
              $rootScope.$apply();
            });
    },
    ui:function (config) {
      var deferred = $q.defer();
        FB.ui(config,
          function (result) {
            console.log(result);
            if (result) {
              $rootScope.$broadcast("fb_socialAction", {'response':config.method});
              deferred.resolve(result);
            }
            else {
              deferred.reject('Canceled');
            }

          });

      return deferred.promise;
    },
    classicShare:function (url) {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),
        'facebook-share-dialog',
        'width=626,height=436,top='+(screen.height-436)/2+',left='+(screen.width-626)/2);
    },
    getFql:function (fql) {
      var deferred = $q.defer();
        FB.api("/fql",
          {
              q:fql

          },
          function (result) {
            deferred.resolve(result);
          });

      return deferred.promise;
    }
    };
  })
  .value('fbData', {});
