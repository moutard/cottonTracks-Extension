module("Cotton.Model.Story",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oStory = new Cotton.Model.Story();
  ok(oStory)
});
