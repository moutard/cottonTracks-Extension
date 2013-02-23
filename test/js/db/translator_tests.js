var A = Class.extend({
  key: 3,
  init: function(){},
});

module("Translator",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("Init Translators", function() {
  var oTranslator = new Cotton.DB.Translator('0.1', function(oObject){
    return {};
  },
  function(dRecord){
    return new A();
  }, {});
  ok(oTranslator);
});

test("Init Translators Collection", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
  });
  ok(oTranslatorCollection);
});

test("Init Translators Collection", function(){
  var oTranslatorCollection = new Cotton.DB.TranslatorsCollection({
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
  });

  var oStory = new Cotton.Model.Story();
  deepEqual(oTranslatorCollection._translatorForObject('stories', oStory)._dIndexDescriptions, {
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
