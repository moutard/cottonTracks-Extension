'use strict';

module('Cotton.UI.Item.Article', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oDispatcher = new MockDispatcher();
  var oItem = new Cotton.UI.Story.Item.Article(oHistoryItem, "*", oDispatcher);
  ok(oItem);
});