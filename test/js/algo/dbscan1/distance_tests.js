'use strict';
var oHistoryItem1 = {
  oExtractedDNA : {
    lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
    lQueryWords : ['alice', 'wonderland', 'film', 'telerama'],
  }
};

var oHistoryItem2 = {
  oExtractedDNA : {
    lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
    lQueryWords : ['alice', 'wonderland', 'novel'],
  }
};

var oHistoryItem3 = {
  oExtractedDNA : {
    lExtractedWords : ['singapor', 'madrid', 'paris'],
    lQueryWords : ['capital', 'country'],
  }
};

var oHistoryItemNull = {
  oExtractedDNA : {
    lExtractedWords : [],
    lQueryWords : [],
  }
};

var oStoryItem = {
  fLastVisitTime: 1353577650178.608,
  fRelevance: null,
  id: 1,
  lTags : ['alice', 'in', 'wonderland', 'the', 'movie'],
  lHistoryItemsId : [1, 2, 3, 4],
  sFeaturedImage : "",
  sTitle : 'Alice in Wonderland'
}

module(
    "Cotton.Algo.Distance",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("distance key.", function() {
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 3}, {foo:4}), 1);
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 4}, {foo:3}), 1);
});

test("distance meaning for the same value.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem1, oHistoryItem1), 0);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oHistoryItem1, oHistoryItem1), 0);
});

test("distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem1, oHistoryItem2), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem2, oHistoryItem1), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem2, oHistoryItem3), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem1, oHistoryItem3), 1);
});

test("distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem1, oHistoryItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oHistoryItem2, oHistoryItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oHistoryItem1, oHistoryItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oHistoryItem1, oHistoryItemNull), 1);
});

test("distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.meaning(oHistoryItem1, oHistoryItem1), 0);
  deepEqual(Cotton.Algo.Distance.meaning(oHistoryItem1, oHistoryItem2), 0.4666666666666667);
  deepEqual(Cotton.Algo.Distance.meaning(oHistoryItem2, oHistoryItemNull), 1);
});

test("distance fromStory.", function() {
  deepEqual(Cotton.Algo.Distance.fromStory(oHistoryItem1, oStoryItem), 0.4);
  deepEqual(Cotton.Algo.Distance.fromStory(oHistoryItem2, oStoryItem), 0.6);
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

