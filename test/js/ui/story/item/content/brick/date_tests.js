'use strict';

module("Cotton.UI.Story.Item.Content.Brick.Date",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oTitle = new Cotton.UI.Story.Item.Content.Brick.Date(1363655245708);
  ok(oTitle);
});

test("init.", function(){
  var oTitle = new Cotton.UI.Story.Item.Content.Brick.Date(1363655245708);
  equal(oTitle._$date.text(), '18 March - 10:07 pm');
});


