'use strict';

module('Cotton.UI.Stand.Common.Cover.UICover', {

});

test('init.', function() {
  var oMockStory = new Cotton.Model.Story();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUICover = new Cotton.UI.Stand.Common.Cover.UICover(oMockStory, oDispatcher);
  ok(oUICover);
});