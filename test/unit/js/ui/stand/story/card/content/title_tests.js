'use strict';

module('Cotton.UI.Stand.Story.Card.Content.Title', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oTitle = new Cotton.UI.Stand.Story.Card.Content.Title(oHistoryItem);
  ok(oTitle);
});