'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Infos', {

});

test('init.', function() {
  var sStoryTitle = "Alice in wonderland";
  var iStoryId = 1;
  var oDispatcher = new MockDispatcher();
  var sTypeOfSticker = "";
  var iNumberOfItems = 15;
  var oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(
    sStoryTitle, iStoryId, oDispatcher, iNumberOfItems);
  ok(oStickerInfos);
});