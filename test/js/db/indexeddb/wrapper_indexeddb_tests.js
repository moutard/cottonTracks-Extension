'use strict';
var TIMEOUT = 4000; // milliseconds.
var oHistoryItem1 = {
  lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
  lQueryWords : ['alice', 'wonderland', 'film'],
};

var oHistoryItem2 = {
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

asyncTest("init with no translator.", function() {
    expect(1);
    var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test-integration', {
      }, function() {
        console.log('database created.')
        ok(true, "Created");
        start();
    });
    setTimeout(function () {
      start();
      ok(false, "Timeout exceed.");
    }, TIMEOUT);
});

asyncTest("init with 2 translators.", function() {
  expect(1);
  var self = this;
  var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test-integration', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
      'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      console.log('database created.')
      ok(true, "Created");
      start();
  });
  setTimeout(function () {
    start();
    ok(false, "Timeout exceed.");
  }, TIMEOUT);
});

asyncTest("init with all translators.", function() {
    expect(1);
    var self = this;
    var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test-integration', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {
        console.log('database created.')
        ok(true, "Created");
        start();
    });
    setTimeout(function () {
      start();
      ok(false, "Timeout exceed.");
    }, TIMEOUT);
});

asyncTest("add search keys with the same keywords.", function() {
    var self = this;
    var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test-integration', {
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {
        var oSearchKeyword = new Cotton.Model.SearchKeyword('wonderland');

        throws(self._oDatabase.put('searchKeywords', oSearchKeyword, function(){}), 'must throw error to pass.');

        throws(self._oDatabase.put('searchKeywords', oSearchKeyword, function(){}), 'must throw error to pass.');

        console.log('database created.')
        ok(true, "Created");
        start();
    });
    setTimeout(function () {
      start();
      ok(false, "Timeout exceed.");
    }, TIMEOUT);
});

asyncTest("put Unique historyItems with the same url.", function() {
  var self = this;
  var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test-integration', {
      'historyItems' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      var oHistoryItem = new Cotton.Model.HistoryItem();
      oHistoryItem.initUrl("http://cottontracks.com");
      self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem,
          function(iId){
          var oHistoryItem2 = new Cotton.Model.HistoryItem();
          oHistoryItem2.initUrl("http://cottontracks.com");
          oHistoryItem2.extractedDNA().addHighlightedText("wonderland");
          self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem2,
              function(iId2){
              equal(iId, iId2);
              self._oDatabase.find('historyItems', 'id', iId2,
                  function(_oHistoryItem){
                    equal(_oHistoryItem.extractedDNA().highlightedText(),
                        "wonderland");
                    start();
              });
          });
      });

      console.log('database created.')
      ok(true, "Created");
  });
  setTimeout(function () {
    start();
    ok(false, "Timeout exceed.");
  }, TIMEOUT);
});

test( "throws", function() {

  function CustomError( message ) {
    this.message = message;
  }

  CustomError.prototype.toString = function() {
    return this.message;
  };

  throws(
    function() {
      throw "error"
    },
    "throws with just a message, no expected"
  );

  throws(
    function() {
      throw new CustomError();
    },
    CustomError,
    "raised error is an instance of CustomError"
  );

  throws(
    function() {
      throw new CustomError("some error description");
    },
    /description/,
    "raised error message contains 'description'"
  );
});


