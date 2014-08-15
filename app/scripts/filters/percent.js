'use strict';

angular.module('iosVsAndroidApp')
  .filter('percent', function () {
    return function (input, total) {
      return Math.floor(input / total * 100) + '%';
    };
  });
