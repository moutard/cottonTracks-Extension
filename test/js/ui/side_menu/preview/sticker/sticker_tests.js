'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Element', {

});

test('init.', function() {
  var oDispatcher = new MockDispatcher();
  var oStory = new Cotton.Model.Story();
  var oStickerElement = new Cotton.UI.SideMenu.Preview.Sticker.Element(
    oStory, oDispatcher);
  ok(oStickerElement);
});
