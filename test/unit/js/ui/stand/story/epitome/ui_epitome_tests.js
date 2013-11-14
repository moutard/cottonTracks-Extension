'use strict';

module('Cotton.UI.Stand.Story.Epitome.UIEpitome', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var iRelatedStories = 10;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUIEpitome = new Cotton.UI.Stand.Story.Epitome.UIEpitome(oMockStory, iRelatedStories, oDispatcher);
  ok(oUIEpitome);
});

test('init no related.', function() {
  var oMockStory = new Cotton.Model.Story();
  var iRelatedStories = 0;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUIEpitome = new Cotton.UI.Stand.Story.Epitome.UIEpitome(oMockStory, iRelatedStories, oDispatcher);
  ok(oUIEpitome);
});