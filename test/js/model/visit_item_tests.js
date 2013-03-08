'use strict';

module("Cotton.DB.Model.VisitItem",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oVisitItem = new Cotton.Model.VisitItem();
  ok(oVisitItem);
});

