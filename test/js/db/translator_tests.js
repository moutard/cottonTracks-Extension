var A = Class.extend({
  key: 3,
  init: function(){},
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


module("Cotton.DB.TranslatorsCollection",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init with no translator.", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
  });
  ok(oTranslatorCollection);
});


test("init with one translator.", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  });
  ok(oTranslatorCollection);
});

test("init with all the translators.", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
  });
  ok(oTranslatorCollection);
});

test("_translatorForObject", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
  });

  var oStory = new Cotton.Model.Story();
  deepEqual(oTranslatorCollection._translatorForObject('stories', oStory)
    ._dIndexDescriptions, {
    "fLastVisitTime": {
      "unique": false
    },
    "id": {
      "unique": true
    },
    "lTags": {
      "multiEntry": true,
      "unique": false
    }
  });

});

test("getIndexesForObjectStoreNames.", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
  });

  var oStory = new Cotton.Model.Story();
  deepEqual(oTranslatorCollection.getIndexesForObjectStoreNames(), {
    "searchKeywords": {
      "id": {
        "unique": true
      },
      "sKeyword": {
        "unique": true
      }
    },
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
      "lTags": {
        "multiEntry": true,
        "unique": false
      }
    },
    "historyItems": {
      "iPool": {
        "unique": false
      },
      "iLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
      "sStoryId": {
        "unique": false
      },
      "sUrl": {
        "unique": false
      }
    }
  });

});

