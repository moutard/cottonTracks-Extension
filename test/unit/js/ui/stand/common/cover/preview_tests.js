'use strict';

module('Cotton.UI.Stand.Common.Cover.Preview', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oPreview = new Cotton.UI.Stand.Common.Cover.Preview(oMockStory, oDispatcher);
  ok(oPreview);
});