'use strict';

module('Cotton.UI.Stand.Story.oDeck', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oDeck = new Cotton.UI.Stand.Story.Deck(oMockStory, oDispatcher);
  ok(oDeck);
});