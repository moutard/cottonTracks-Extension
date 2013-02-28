'use strict';
var TIMEOUT = 1000; // milliseconds.
var oVisitItem1 = {
  lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
  lQueryWords : ['alice', 'wonderland', 'film'],
};

var oVisitItem2 = {
  lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll'],
  lQueryWords : ['alice', 'wonderland', 'novel'],
};


module(
    "Cotton.DB.IndexedDB.Wrapper",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


asyncTest("Cotton.DB.IndexedDB.Wrapper - init.", function() {
    expect(1);
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {
        console.log('database created.')
        ok(true, "Created");
        start();
    });

});


