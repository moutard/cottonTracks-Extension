'use strict';

module("Cotton.UI.Story.Item.Content.Brick.Title",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oTitle = new Cotton.UI.Story.Item.Content.Brick.Title('Alice in wonderland');
  ok(oTitle);
});

