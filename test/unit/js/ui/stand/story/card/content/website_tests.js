'use strict';

module('Cotton.UI.Stand.Story.Card.Content.Website', {

});

test('init.', function() {
  var sUrl = "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland";
  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oWebsite = new Cotton.UI.Stand.Story.Card.Content.Website(sUrl, oDispatcher);
  ok(oWebsite);
});

test("domain.", function(){
  var sUrl = "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland";
  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oWebsite = new Cotton.UI.Stand.Story.Card.Content.Website(sUrl, oDispatcher);
  equal(oWebsite.$().text(), 'en.wikipedia.org');
});