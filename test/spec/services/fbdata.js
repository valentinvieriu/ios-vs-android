'use strict';

describe('Service: fbData', function () {

  // load the service's module
  beforeEach(module('iosVsAndroidApp'));

  // instantiate service
  var fbData;
  beforeEach(inject(function (_fbData_) {
    fbData = _fbData_;
  }));

  it('should do something', function () {
    expect(!!fbData).toBe(true);
  });

});
