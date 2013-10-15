'use strict';

describe('Service: processData', function () {

  // load the service's module
  beforeEach(module('iosVSAndroidApp'));

  // instantiate service
  var processData;
  beforeEach(inject(function (_processData_) {
    processData = _processData_;
  }));

  it('should do something', function () {
    expect(!!processData).toBe(true);
  });

});
