'use strict';

module('Cotton.UI.Item.Video', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispacher = new MockDispacher();
  var oItem = new Cotton.UI.Story.Item.Video("g0lbfEb8MMk","youtube",
    oHistoryItem, oDispacher);
  ok(oItem);
});

test('check sVideo parameters', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispacher = new MockDispacher();
  var oItem = new Cotton.UI.Story.Item.Video("g0lbfEb8MMk","youtube",
    oHistoryItem, oDispacher);
  equal(oItem._oVideo._sVideoType, "youtube");
});

