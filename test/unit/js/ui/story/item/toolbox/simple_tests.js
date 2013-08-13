'use strict';

module('Cotton.UI.Item.Toolbox.Simple', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oSimpleToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(oHistoryItem['sUrl']);
  ok(oSimpleToolbox);
});