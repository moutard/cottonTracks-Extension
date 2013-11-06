'use strict';

module('Cotton.UI.Stand.Story.Card.Content.Video', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oVideo = new Cotton.UI.Stand.Story.Card.Content.Video("g0lbfEb8MMk", "youtube", oDispatcher);
  ok(oVideo);
});