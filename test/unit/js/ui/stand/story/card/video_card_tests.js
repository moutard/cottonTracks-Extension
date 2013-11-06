'use strict';

module('Cotton.UI.Stand.Story.Card.Video', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oVideoCard = new Cotton.UI.Stand.Story.Card.Video("g0lbfEb8MMk","youtube",
    oHistoryItem, oDispatcher);
  ok(oVideoCard);
});