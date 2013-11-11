module("Cotton.DB.Translators.HistoryItem",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var dDBRecord = {
    'id': 3
    'sUrl': "http://de"
  };
  var oHistoryItem = new Cotton.Model.HistoryItem();
  ok(oHistoryItem);
});

