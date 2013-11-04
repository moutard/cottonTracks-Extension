'use strict';

module('Cotton.Core.Webstore', {

});

test('init.', function() {
  var oWebstore = new Cotton.Core.Webstore();
  ok(oWebstore);
});

test('Webstore Name.', function() {
  var sBrowser = Cotton.Core.Browser();

  if (sBrowser === "Chrome") {
    var sWebstoreName = "the Chrome Web Store"
  } else if (sBrowser === "Opera") {
    var sWebstoreName = "Opera add-ons";
  }

  var oWebstore = new Cotton.Core.Webstore();
  deepEqual(oWebstore.getName(), sWebstoreName);
});

test('Webstore Url.', function() {
  var sBrowser = Cotton.Core.Browser();

  if (sBrowser === "Chrome") {
    var sWebstoreUrl = "https://chrome.google.com/webstore/detail/cottontracks/flmfagndkngjknjjcoejaihmibcfcjdh/reviews";
  } else if (sBrowser === "Opera") {
    var sWebstoreUrl = "https://addons.opera.com/extensions/details/cottontracks/#feedback-container";
  }

  var oWebstore = new Cotton.Core.Webstore();
  deepEqual(oWebstore.getUrl(), sWebstoreUrl);
});