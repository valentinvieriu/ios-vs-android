'use strict';

/**
 * @ngdoc directive
 * @name iosVsAndroidApp.directive:facepile
 * @description
 * # facepile
 */
angular.module('iosVsAndroidApp')
  .directive('facepile', function () {
  	return {
  	  template : '<iframe scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:600px;" allowTransparency="true"></iframe>',
  	  restrict : 'E',
  	  replace  : true,
  	  controller : function(Facebook) {
  	  	this.appId = Facebook.appId;
  	  },
  	  link: function postLink(scope, element, attrs, controller) {
  	    var fbUrl    = '//www.facebook.com/plugins/facepile.php?colorscheme=light&show_count=true';
  	    var app_id   = '&app_id=' + controller.appId;
  	    var width    = '&width=' + (attrs.width || 600);
  	    var size     = '&size=' + (attrs.size || 'large');
  	    var max_rows = '&max_rows=' + (attrs.max_rows || '1');

  	    fbUrl = fbUrl + app_id + width + size + max_rows;
  	    element.attr('src',fbUrl);
  	  }
  	}
  });
