'use strict';

module('Cotton.UI.Stand.Common.Sticker', {

});

test('init from cover.', function() {
  var oMockStory = new Cotton.Model.Story();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oSticker = new Cotton.UI.Stand.Common.Sticker(oMockStory, 'cover', oDispatcher);
  ok(oSticker);
});

test('init from epitome.', function() {
  var oMockStory = new Cotton.Model.Story();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oSticker = new Cotton.UI.Stand.Common.Sticker(oMockStory, 'epitome', oDispatcher);
  ok(oSticker);
});
