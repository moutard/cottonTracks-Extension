'use strict';

module('Cotton.UI.Stand.Story.Dashboard', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var iRelatedStories = 5;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oDashboard = new Cotton.UI.Stand.Story.Dashboard(oMockStory, iRelatedStories, oDispatcher);
  ok(oDashboard);
});

test('init no related.', function() {
  var oMockStory = new Cotton.Model.Story();
  var iRelatedStories = 0;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oDashboard = new Cotton.UI.Stand.Story.Dashboard(oMockStory, iRelatedStories, oDispatcher);
  ok(oDashboard);
});