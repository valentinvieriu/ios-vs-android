'use strict';

describe('Service: FacebookProvider', function () {

  // load the service's module
  beforeEach(module('FacebookProvider'));

  // instantiate service
  var FacebookProvider;
  beforeEach(inject(function (_FacebookProvider_) {
    FacebookProvider = _FacebookProvider_;
  }));

  it('should do something', function () {
    expect(!!FacebookProvider).toBe(true);
  });

});
