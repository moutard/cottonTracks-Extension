'use strict';

module('Cotton.UI.Stand.Story.Card.Content.ImageFeatured', {

});

test('init.', function() {
  var sUrl = "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland";
  var oImageFeatured = new Cotton.UI.Stand.Story.Card.Content.ImageFeatured(sUrl);
  ok(oImageFeatured);
});