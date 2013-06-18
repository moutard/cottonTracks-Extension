'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Infos', {

});

test('init.', function() {
  var sStoryTitle = "Alice in wonderland";
  var oDispatcher = new MockDispatcher();
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(
    sStoryTitle, oDispatcher);
  ok(oStickerInfos);
});
