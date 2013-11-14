'use strict';

module('Cotton.UI.Stand.Story.Card.Content.ImageFull', {

});

test('init.', function() {
  var sUrl = "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland";
  var oImageFull = new Cotton.UI.Stand.Story.Card.Content.ImageFull(sUrl);
  ok(oImageFull);
});