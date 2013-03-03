module("Model.Story",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("Model.Story - init", function() {
  var urlSimple   = 'http://www.google.com/search?p=dede&q=keyword1+keyword2+keyword3&aq=autre';
  var oStory = new Cotton.Model.Story();
  ok(oStory)
});