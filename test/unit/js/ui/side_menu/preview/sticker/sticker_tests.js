'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Element', {

});

test('init.', function() {
  var oDispatcher = new MockDispatcher();
  var oStory = new Cotton.Model.Story();
  var stypeOfSticker = "";
  var oStickerElement = new Cotton.UI.SideMenu.Preview.Sticker.Element(
    oStory, oDispatcher, stypeOfSticker);
  ok(oStickerElement);
});

test('init related.', function() {
  var oDispatcher = new MockDispatcher();
  var oStory = new Cotton.Model.Story();
  var stypeOfSticker = "relatedStory";
  var oStickerElement = new Cotton.UI.SideMenu.Preview.Sticker.Element(
    oStory, oDispatcher, stypeOfSticker);
  ok(oStickerElement);
});
