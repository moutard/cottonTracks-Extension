'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Infos', {

});

test('init.', function() {
  var sStoryTitle = "Alice in wonderland"
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(sStoryTitle);
  ok(oStickerInfos);
});
