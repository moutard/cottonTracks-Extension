'use strict';

module("Cotton.UI.Story.Item.Content.Dna.Reader",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oHistoryItemDna = new Cotton.Model.HistoryItemDNA({
    'lQueryWords': [],
  });
  var oReader = new Cotton.UI.Story.Item.Content.Dna.Reader(oHistoryItemDna);
  ok(oReader);
});

