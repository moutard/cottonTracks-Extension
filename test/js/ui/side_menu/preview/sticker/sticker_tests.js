'use strict';

module('Cotton.UI.SideMenu.Preview.Sticker.Element', {

});

test('init.', function() {
  var oDispacher = new MockDispacher();
  var oStory = new Cotton.Model.Story();
  var oStickerElement = new Cotton.UI.SideMenu.Preview.Sticker.Element(
    oStory, oDispacher);
  ok(oStickerElement);
});
