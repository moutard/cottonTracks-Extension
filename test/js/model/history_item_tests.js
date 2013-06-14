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

test("default getters.", function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({});
  equal(oHistoryItem.url(), undefined)
  equal(oHistoryItem.title(), "");
  equal(oHistoryItem.lastVisitTime(), undefined);
  equal(oHistoryItem.storyId(), -1);
});

test("setters", function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({});
  oHistoryItem.initUrl("http://alice.com");
  oHistoryItem.setTitle("Alice in wonderland");
  oHistoryItem.setLastVisitTime(13);
  oHistoryItem.setStoryId(33);

  equal(oHistoryItem.url(), "http://alice.com")
  equal(oHistoryItem.title(), "Alice in wonderland");
  equal(oHistoryItem.lastVisitTime(), 13);
  equal(oHistoryItem.storyId(), 33);
  deepEqual(oHistoryItem.dbRecord(), {
    'sUrl': "http://alice.com",
    'sTitle': "Alice in wonderland",
    'iStoryId': 33,
    'iLastVisitTime': 13,
    'oExtractedDNA': {

    },
    'lParagraphs': []
  });
});

test("bag of words.", function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({});
  oHistoryItem.extractedDNA().bagOfWords().addWord("Alice", 3);

  deepEqual(oHistoryItem.dbRecord(), {
    "oExtractedDNA": {
      "dBagOfWords": {
        "alice": 3
      },
      "lParagraphs": []
    }
  });
});

