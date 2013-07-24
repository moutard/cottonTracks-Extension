'use strict';

module('Cotton.UI.Item.Toolbox.Complexe', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });
  var oComplexeToolbox = new Cotton.UI.Story.Item.Toolbox.Complexe(true, true, oHistoryItem['sUrl']);
  ok(oComplexeToolbox);
});
