'use strict';

module('Cotton.UI.Item.Image', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oContent = new Cotton.UI.Story.Item.Image(oHistoryItem.url(), oHistoryItem);
  ok(oContent);
});
