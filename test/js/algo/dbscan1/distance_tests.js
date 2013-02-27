'use strict';
var oVisitItem1 = {
  oExtractedDNA : {
    lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
    lQueryWords : ['alice', 'wonderland', 'film', 'telerama'],
  }
};

var oVisitItem2 = {
  oExtractedDNA : {
    lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
    lQueryWords : ['alice', 'wonderland', 'novel'],
  }
};

var oVisitItem3 = {
  oExtractedDNA : {
    lExtractedWords : ['singapor', 'madrid', 'paris'],
    lQueryWords : ['capital', 'country'],
  }
};

var oVisitItemNull = {
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
  lVisitItemsId : [1, 2, 3, 4],
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


test("Cotton.Algo.Distance - distance key.", function() {
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 3}, {foo:4}), 1);
  deepEqual(Cotton.Algo.Distance.distanceKey("foo", {foo: 4}, {foo:3}), 1);
});

test("Cotton.Algo.Distance - distance meaning for the same value.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem1, oVisitItem1), 0);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItem1), 0);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem1, oVisitItem2), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem2, oVisitItem1), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem2, oVisitItem3), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem1, oVisitItem3), 1);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem1, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonExtractedWords(oVisitItem2, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItemNull), 1);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem1, oVisitItem1), 0);
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem1, oVisitItem2), 0.4666666666666667);
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem2, oVisitItemNull), 1);
});

test("Cotton.Algo.Distance - distance fromStory.", function() {
  deepEqual(Cotton.Algo.Distance.fromStory(oVisitItem1, oStoryItem), 0.4);
  deepEqual(Cotton.Algo.Distance.fromStory(oVisitItem2, oStoryItem), 0.6);
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


test("Cotton.Algo.Distance.Metrics - Cosine.", function() {
  var dBagOfWords1 = {'a':1, 'b':2, 'c':3, 'd':4, 'g': 5};
  var dBagOfWords2 = {'b':2, 'c':3, 'd':4, 'e':5, 'f':6, 'g':7};
  equal(Cotton.Algo.Metrics.Cosine(dBagOfWords1, dBagOfWords2), 64);
});

