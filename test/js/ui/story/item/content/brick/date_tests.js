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
  var date = new Date(1363655245708);
  var iHours = date.getHours() % 12;
  var sWrittenDate = '18 March - ' + iHours + ':' + '0' + date.getMinutes() + ' pm';
  equal(oTitle._$date.text(), sWrittenDate);
});


