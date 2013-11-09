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
  var oHistoryItem = new Cotton.Model.HistoryItem();
  ok(oHistoryItem);
});

test("init. complex history item.", function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
      'sUrl': "http://init.complex.com",
      'iVisitCount': 3,
      'oExtractedDNA': {
        'oBagOfWords': {
          'second': 4
        }
      }
    });
  deepEqual(oHistoryItem.extractedDNA().bagOfWords().get(), {'second':4});
});
