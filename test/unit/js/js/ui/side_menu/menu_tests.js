'use strict';

module('Cotton.UI.SideMenu.Menu', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story();
  var oDispatcher = new MockDispatcher();
  var iNumberOfRelated = 0;
  var oMenu = new Cotton.UI.SideMenu.Menu(oStory, oDispatcher, iNumberOfRelated);
  ok(oMenu);
});
