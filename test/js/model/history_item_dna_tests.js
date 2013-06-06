'use strict';

module("Cotton.DB.Model.HistoryItemDNA",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  ok(oHistoryItemDNA);
});

test("setQueryWords.", function() {
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setQueryWords(['the', 'Magical', 'Mystery', 'Tour', 'of', 'the', 'Beatles']);
  var lQueryWords = ['the', 'Magical', 'Mystery', 'Tour', 'of', 'the', 'Beatles'];
  deepEqual(oHistoryItemDNA.queryWords(), lQueryWords);
});

test("setStrongQueryWords.", function(){
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setStrongQueryWords(['Magical', 'Mystery', 'Tour', 'Beatles']);
  var dBagOfWords = {"magical": 5, "mystery": 5, "tour": 5, "beatles": 5}
  deepEqual(oHistoryItemDNA.bagOfWords().get(), dBagOfWords);
});

test("setWeakQueryWords.", function(){
  var oHistoryItemDNA = new Cotton.Model.HistoryItemDNA({});
  oHistoryItemDNA.setWeakQueryWords(['the', 'of', 'the']);
  var dBagOfWords = {"the": 2, "of": 2}
  deepEqual(oHistoryItemDNA.bagOfWords().get(), dBagOfWords);
});
