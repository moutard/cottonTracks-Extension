'use strict';

module("Cotton.DB.Model.StoryDNA",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oStoryDNA = new Cotton.Model.StoryDNA();
  ok(oStoryDNA);
});

