'use strict';

module("Cotton.UI.Story.Item.Content.Brick.Dna.Reader",{
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
  var oDispatcher = new MockDispatcher();
  var oReader = new Cotton.UI.Story.Item.Content.Brick.Dna.Reader(oHistoryItemDna, 1, oDispatcher);
  ok(oReader);
});

