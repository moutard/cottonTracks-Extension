'use strict';

module('Cotton.UI.SideMenu.Menu', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story();
  var oMenu = new Cotton.UI.SideMenu.Menu(oStory);
  ok(oMenu);
});
