'use strict';

module('Cotton.UI.Stand.Story.RelatedDeck', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oRelatedDeck = new Cotton.UI.Stand.Story.RelatedDeck(oDispatcher);
  ok(oRelatedDeck);
});