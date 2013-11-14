'use strict';

module('Cotton.Core.Browser', {

});

test('browser detection.', function() {

  var userAgent = navigator.userAgent;

  if (userAgent.search("OPR") > 0) {
    var sBrowser = "Opera";
  } else if (userAgent.search("Chrome") > 0) {
    var sBrowser = "Chrome";
  }
  deepEqual(sBrowser, Cotton.Core.Browser());
});