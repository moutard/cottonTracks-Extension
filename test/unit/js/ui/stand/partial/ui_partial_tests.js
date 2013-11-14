'use strict';

module('Cotton.UI.Stand.Partial.UIPartial', {

});

test('init.', function() {
  var lMockStories = [];
  for (var i = 0; i < 10; i++){
    var oMockStory = new Cotton.Model.Story();
    lMockStories.push(oMockStory);
  }

  var sTitle = "Partial Test Title";

  var sEmptyMessage = "There is nothing in this partial";

  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oPartial = new Cotton.UI.Stand.Partial.UIPartial(lMockStories, sTitle, sEmptyMessage, oDispatcher);
  ok(oPartial);
});


test('init empty partial.', function() {
  var lNoStories = [];
  var sTitle = "Partial Test Title";

  var sEmptyMessage = "There is nothing in this partial";

  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oPartial = new Cotton.UI.Stand.Partial.UIPartial(lNoStories, sTitle, sEmptyMessage, oDispatcher);
  ok(oPartial);
});