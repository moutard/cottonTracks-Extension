'use strict';

module('Cotton.UI.Stand.Story.Card.CardAdder', {

});

test('init.', function() {
  var iStoryId = 23;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oCardAdder = new Cotton.UI.Stand.Story.Card.CardAdder(iStoryId, oDispatcher);
  ok(oCardAdder);
});