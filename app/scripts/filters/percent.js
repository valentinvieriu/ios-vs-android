'use strict';

angular.module('iosVSAndroidApp')
  .filter('percent', function () {
    return function (input, total) {
      console.log(arguments);
      return Math.floor(input / total * 100) + '%';
    };
  });
