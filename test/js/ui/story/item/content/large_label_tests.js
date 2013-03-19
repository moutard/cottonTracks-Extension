'use strict';

module("Cotton.UI.Story.Item.Content.LargeLabel",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oLargeLabel = new Cotton.UI.Story.Item.Content.LargeLabel("Alice in wonderland",
    "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland");
  ok(oLargeLabel);
});

