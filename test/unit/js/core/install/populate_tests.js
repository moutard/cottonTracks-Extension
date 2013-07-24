module("Cotton.Core.Install.Populate",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});


test("preRemoveTools.", function() {
  var lChromeHistoryItem = chrome_history_source_japan;
  var lResult = Cotton.Core.Populate.preRemoveTools(lChromeHistoryItem);
  equal(lResult.length, 29);
});

