module("Cotton.Core.Install.TempDatabase",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});


test("preRemoveTools.", function() {
  var lChromeHistoryItem = chrome_history_source_japan;
  var oTempDatabase = new Cotton.Core.TempDatabase();
  var lResult = oTempDatabase.removeExcludedItem(lChromeHistoryItem);
  equal(lResult.length, 29);
});

