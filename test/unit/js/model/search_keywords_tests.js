'use strict';

module("Cotton.DB.Model.SearchKeyword",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oBagOfWords = new Cotton.Model.SearchKeyword('wonderland');
  ok(oBagOfWords);
});

