'use strict';

module('Cotton.UI.Stand.Story.UIStory', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var lRelatedStories = [];
  for (var i = 0; i < 10; i++) {
    var oRelatedStory = new Cotton.Model.Story();
    lRelatedStories.push(oRelatedStory);
  }
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUIStory = new Cotton.UI.Stand.Story.UIStory(oMockStory, lRelatedStories, oDispatcher);
  ok(oUIStory);
});

test('init no related.', function() {
  var oMockStory = new Cotton.Model.Story();
  var lRelatedStories = [];
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUIStory = new Cotton.UI.Stand.Story.UIStory(oMockStory, lRelatedStories, oDispatcher);
  ok(oUIStory);
});