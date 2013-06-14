'use strict';

module('Cotton.UI.Story.Element', {

});

test('init.', function() {
  var oStory = new Cotton.Model.Story({});
  var oDispacher = new MockDispacher();
  var oStoryElement = new Cotton.UI.Story.Element(oStory, oDispacher);
  ok(oStoryElement);
});
