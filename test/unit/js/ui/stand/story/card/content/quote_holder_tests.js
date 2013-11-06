'use strict';

module('Cotton.UI.Stand.Story.Card.Content.QuoteHolder', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oQuoteHolder = new Cotton.UI.Stand.Story.Card.Content.QuoteHolder(oHistoryItem, oDispatcher);
  ok(oQuoteHolder);
});
