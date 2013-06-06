'use strict';

module("Cotton.DB.Model.HistoryItem",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({});
  ok(oHistoryItem);
});

