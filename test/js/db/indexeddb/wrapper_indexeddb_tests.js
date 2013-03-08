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

asyncTest("init with no translator.", function() {
    expect(1);
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test', {
      }, function() {
        console.log('database created.')
        ok(true, "Created");
        start();
    });
});

asyncTest("init with all translators.", function() {
    expect(1);
    var self = this;
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

asyncTest("add search keys with the same keywords.", function() {
    var self = this;
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct-test', {
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {
        var oSearchKeyword = new Cotton.Model.SearchKeyword('wonderland');

        throws(self._oDatabase.put('searchKeywords', oSearchKeyword, function(){}), 'must throw error to pass.');

        throws(self._oDatabase.put('searchKeywords', oSearchKeyword, function(){}), 'must throw error to pass.');

        console.log('database created.')
        ok(true, "Created");
        start();
    });

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


