'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Infos', {

});

test('init.', function() {
  var sStoryTitle = "Alice in wonderland";
  var oDispacher = new MockDispacher();
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(
    sStoryTitle, oDispacher);
  ok(oStickerInfos);
});
