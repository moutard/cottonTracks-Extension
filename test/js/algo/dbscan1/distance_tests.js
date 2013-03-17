'use strict';
Cotton.Test.Data.Distance = {};

module(
    "Cotton.Algo.Distance",
    {
      'setup' : function() {
        Cotton.Test.Data.Distance.oHistoryItem1 = {
          'oExtractedDNA' : {
            'lExtractedWords' : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
            'lQueryWords' : ['alice', 'wonderland', 'film', 'telerama'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItem2 = {
          'oExtractedDNA' : {
            'lExtractedWords' : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
            'lQueryWords' : ['alice', 'wonderland', 'novel'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItem3 = {
          'oExtractedDNA' : {
            'lExtractedWords' : ['singapor', 'madrid', 'paris'],
            'lQueryWords' : ['capital', 'country'],
          }
        };

        Cotton.Test.Data.Distance.oHistoryItemNull = {
          'oExtractedDNA' : {
            'lExtractedWords' : [],
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

test("distance commonExtractedWords for the same value.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem1), 0);
});

test("distance commonQueryWords for the same value.", function() {
  deepEqual(Cotton.Algo.Distance.commonQueryWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem1), 0);
});

test("distance commonExtractedWords for null value.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem2,
      Cotton.Test.Data.Distance.oHistoryItemNull), 1);
});

test("distance commonQueryWords for null value.", function() {
  deepEqual(Cotton.Algo.Distance.commonQueryWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItemNull), 1);
});

test("distance commonExtractedWords.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem2), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem2,
      Cotton.Test.Data.Distance.oHistoryItem1), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem2,
      Cotton.Test.Data.Distance.oHistoryItem3), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem3), 1);
});


test("distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.meaning(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem1), 0);
  deepEqual(Cotton.Algo.Distance.meaning(
      Cotton.Test.Data.Distance.oHistoryItem1,
      Cotton.Test.Data.Distance.oHistoryItem2), 0.4666666666666667);
  deepEqual(Cotton.Algo.Distance.meaning(
      Cotton.Test.Data.Distance.oHistoryItem2,
      Cotton.Test.Data.Distance.oHistoryItemNull), 1);
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
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords2), 64);
});

