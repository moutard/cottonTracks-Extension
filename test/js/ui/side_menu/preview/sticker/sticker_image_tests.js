'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Image', {

});

test('init.', function() {
  var sStoryImage = "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg";
  var oDispacher = new MockDispacher();
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(
    sStoryImage, oDispacher);
  ok(oStickerInfos);
});
