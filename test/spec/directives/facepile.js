'use strict';

describe('Directive: facepile', function () {

  // load the directive's module
  beforeEach(module('iosVsAndroidApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<facepile></facepile>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the facepile directive');
  }));
});
