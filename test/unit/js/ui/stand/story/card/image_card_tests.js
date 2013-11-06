'use strict';

module('Cotton.UI.Stand.Story.Card.Image', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oImageCard = new Cotton.UI.Stand.Story.Card.Image(oHistoryItem.url(), oHistoryItem, oDispatcher);
  ok(oImageCard);
});
