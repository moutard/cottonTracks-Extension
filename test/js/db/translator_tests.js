var A = Class.extend({
  key : undefined,
  init : function(){
    this.key = 3;
  },
});

module("Cotton.DB.Translator",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init", function() {
  var oTranslator = new Cotton.DB.Translator('0.1', function(oObject){
    return {};
  },
  function(dRecord){
    return new A();
  }, {});
  ok(oTranslator);
});

test("extra method for historyItem translator.", function() {
  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
  var oHistoryItem = oTranslator.chromeHistoryItemToObject({
      "id": "18148",
      "lastVisitTime": 1345067625020.5059,
      "title": "(1) Japanese-French-German Roadtrip in France",
      "typedCount": 0,
      "url": "https://www.facebook.com/photo.php?fbid=10152068458770657&set=a.10152068448065657.900421.845025656&type=1",
    });
  equal(oHistoryItem.title(), "(1) Japanese-French-German Roadtrip in France")

});

module("Cotton.DB.TranslatorsCollection",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});


