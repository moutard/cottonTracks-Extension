'use strict';

module('Cotton.UI.SideMenu.Menu', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story();
  var oDispacher = new MockDispacher();
  var oMenu = new Cotton.UI.SideMenu.Menu(oStory, oDispacher);
  ok(oMenu);
});
