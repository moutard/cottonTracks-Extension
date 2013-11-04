'use strict';

module('Cotton.Core.Favicon', {

});

test('init.', function() {
  var oFavicon = new Cotton.Core.Favicon();
  ok(oFavicon);
});

test('Favicon Url.', function() {
  var sBrowser = Cotton.Core.Browser();

  var oFavicon = new Cotton.Core.Favicon();
  deepEqual(oFavicon.getSrc(), sBrowser.toLowerCase() + "://favicon/");
});