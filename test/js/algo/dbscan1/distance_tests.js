'use strict';
Cotton.Test.Data.Distance = {};

module(
    "Cotton.Algo.Distance",
    {
      'setup' : function() {
        Cotton.Test.Data.Distance.oHistoryItem1 = {
          'oExtractedDNA' : {
            'lQueryWords' : ['alice', 'wonderland', 'film', 'telerama'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItem2 = {
          'oExtractedDNA' : {
            'lQueryWords' : ['alice', 'wonderland', 'novel'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItem3 = {
          'oExtractedDNA' : {
            'lQueryWords' : ['capital', 'country'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryNinjutsu = {
          'oExtractedDNA' : {
            'lQueryWords' : [],
          }
        };

        Cotton.Test.Data.Distance.oNinjutsu = {
          'oExtractedDNA' : {
            'lQueryWords' : [],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItemNull = {
          'oExtractedDNA' : {
            'lQueryWords' : [],
          }
        };

        Cotton.Test.Data.Distance.oStoryItem = {
          'fLastVisitTime': 1353577650178.608,
          'fRelevance': null,
          'id': 1,
          'lTags' : ['alice', 'in', 'wonderland', 'the', 'movie'],
          'lHistoryItemsId' : [1, 2, 3, 4],
          'sFeaturedImage' : "",
          'sTitle' : 'Alice in Wonderland'
        }

      },
      'teardown' : function() {
        // runs after each test
      }
    }
);


test("distance key.", function() {
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 3}, {foo:4}), 1);
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 4}, {foo:3}), 1);
});

test("distance fromStory.", function() {
  deepEqual(Cotton.Algo.Distance.fromStory(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oStoryItem), 0.4);
  deepEqual(Cotton.Algo.Distance.fromStory(
      Cotton.Test.Data.Distance.oHistoryItem2,
      Cotton.Test.Data.Distance.oStoryItem), 0.6);
});

module(
    "Cotton.Algo.Distance.Metrics",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("cosine.", function() {
  var dBagOfWords1 = {'a':1, 'b':2, 'c':3, 'd':4, 'g': 5};
  var dBagOfWords2 = {'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords2), 66);
});

test("cosine equal with empty bag of words.", function() {
  var dBagOfWords1 = {};
  var dBagOfWords2 = {'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords1), 0);
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords2, dBagOfWords2), 0);
});

test("cosine equal with empty bag of words.", function() {
  var dBagOfWords1 = {};
  var dBagOfWords2 = {};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords1), 0);
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords2, dBagOfWords2), 0);
});


test("cosine equal vector.", function() {
  var dBagOfWords1 = {'a':1, 'b':2, 'c':3, 'd':4, 'g': 5};
  var dBagOfWords2 = {'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords1), 0);
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords2, dBagOfWords2), 0);
});

test("cosine non common dimension vector", function() {
  var dBagOfWords1 = {'a':1, 'c':3, 'g':7};
  var dBagOfWords2 = {'b':2, 'd':4, 'e':5, 'f':6};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords2), 140);
});

test("cosine small dimension with config parameters", function() {
  var dBagOfWords1 = {
    'alice':Cotton.Config.Parameters.scoreForExtractedWords,
    'wonderland':Cotton.Config.Parameters.scoreForExtractedWords
  };
  var dBagOfWords2 = {
    'alice':Cotton.Config.Parameters.scoreForExtractedWords,
    'wonderland':Cotton.Config.Parameters.scoreForExtractedWords,
    'movie' :Cotton.Config.Parameters.scoreForExtractedWords,
    'tim' :Cotton.Config.Parameters.scoreForExtractedWords,
    'burton' :Cotton.Config.Parameters.scoreForExtractedWords,
  };

  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords2), 27);
});

