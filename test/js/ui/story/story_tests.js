'use strict';

module('Cotton.UI.Story.Element', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story();
  var oStoryElement = new Cotton.UI.Story.Element(oStory);
  ok(oStoryElement);
});
