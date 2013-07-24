'use strict';

module('Cotton.UI.SideMenu.Preview.Element', {

});

test('init.', function() {
  var sTitle = "Alice in wonderland";
  var sStoryImage = "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg";
  var oStory = new Cotton.Model.Story();

  var oDispatcher = new MockDispatcher();
  var oPreviewElement = new Cotton.UI.SideMenu.Preview.Element(
    oStory, oDispatcher);
  ok(oPreviewElement);
});
