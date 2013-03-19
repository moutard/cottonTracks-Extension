'use strict';

module("Cotton.UI.Story.Item.Content.Dna.Image",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oImage = new Cotton.UI.Story.Item.Content.Dna.Image("http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg");
  ok(oImage);
});
