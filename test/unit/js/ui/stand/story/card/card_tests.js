'use strict';

module('Cotton.UI.Stand.Story.Card.Card', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oCard = new Cotton.UI.Stand.Story.Card.Card(oHistoryItem, oDispatcher);
  ok(oCard);
});
