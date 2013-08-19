'use strict';

module("Cotton.DB.Model.ExtractedParagraph",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init with only text.", function() {
  var oExtractedParagraph = new Cotton.Model.ExtractedParagraph("She was sleeping.");
  ok(oExtractedParagraph);
});

test("init with text and quotes.", function() {
  var oExtractedParagraph = new Cotton.Model.ExtractedParagraph("She was sleeping.", [{'start': 8, 'end': 15}]);
  ok(oExtractedParagraph);
});


test("setters.", function() {
  var oExtractedParagraph = new Cotton.Model.ExtractedParagraph("She was sleeping.", [{'start': 8, 'end': 15}]);
  deepEqual(oExtractedParagraph.text(), "She was sleeping.");
  deepEqual(oExtractedParagraph.percent(), 0);
  deepEqual(oExtractedParagraph.quotes(), [{'start': 8, 'end': 15}]);

});
