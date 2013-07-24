'use strict';

module("Cotton.UI.Story.Item.Content.Brick.SmallLabel",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oSmallLabel = new Cotton.UI.Story.Item.Content.Brick.SmallLabel(
    "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland");
  ok(oSmallLabel);
});

