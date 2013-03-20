'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Element', {

});

test('init.', function() {
  var sTitle = "Alice in wonderland"
  var sStoryImage = "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg";
  var oStickerElement = new Cotton.UI.SideMenu.Preview.Sticker.Element(
    sTitle, sStoryImage);
  ok(oStickerElement);
});
