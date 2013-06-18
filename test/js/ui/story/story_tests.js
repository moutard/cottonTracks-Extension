'use strict';

module('Cotton.UI.Story.Element', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story();
  var oDispatcher = new MockDispatcher();
  var oStoryElement = new Cotton.UI.Story.Element(oStory, oDispatcher);
  ok(oStoryElement);
});
