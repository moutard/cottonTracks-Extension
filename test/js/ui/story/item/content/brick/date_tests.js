'use strict';

module("Cotton.UI.Story.Item.Content.Brick.Date",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("preview of date is correct.", function() {
  //Date is dependant of the local time config of the
  //browser. for test we need to use UTC to avoid problems.
  // Months and hours starts by 0 !
  var a = Date.UTC(2012, 2, 18, 7, 6, 5);
  var oTitle = new Cotton.UI.Story.Item.Content.Brick.Date(a);
  equal(oTitle._$date.text(), '18 March - 8:06 am');
});

test("preview of date is correct.", function() {
  //Date is dependant of the local time config of the
  //browser. for test we need to use UTC to avoid problems.
  // Months and hours starts by 0 !
  var a = Date.UTC(2012, 2, 18, 9, 6, 5);
  var oTitle = new Cotton.UI.Story.Item.Content.Brick.Date(a);
  equal(oTitle._$date.text(), '18 March - 10:06 am');
});

