'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Image', {

});

test('init.', function() {
  var sStoryImage = "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg";
  var oDispatcher = new MockDispatcher();
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Image(
    sStoryImage);
  ok(oStickerInfos);
});
