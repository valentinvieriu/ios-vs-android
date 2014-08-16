'use strict';

/**
 * @ngdoc directive
 * @name iosVsAndroidApp.directive:simpleShare
 * @description
 * # simpleShare
 */
angular.module('iosVsAndroidApp')
  .directive('simpleShare', function ($window) {
    return {
      restrict: 'A',
      scope :{
      	url : "@simpleShare"
      },
      link: function postLink(scope, element, attrs) {
      	var url = scope.url;
        element.bind('click', function(evt){
        	$window.open(
        	  'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),
        	  'facebook-share-dialog',
        	  'width=626,height=436,top='+($window.screen.height-436)/2+',left='+($window.screen.width-626)/2);
        });
      }
    };
  });