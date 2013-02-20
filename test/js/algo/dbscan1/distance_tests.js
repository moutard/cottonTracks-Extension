'use strict';
var oVisitItem1 = {
  lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
  lQueryWords : ['alice', 'wonderland', 'film', 'telerama'],
};

var oVisitItem2 = {
  lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
  lQueryWords : ['alice', 'wonderland', 'novel'],
};

var oVisitItem3 = {
  lExtractedWords : ['singapor', 'madrid', 'paris'],
  lQueryWords : ['capital', 'country'],
};

var oVisitItemNull = {
  lExtractedWords : [],
  lQueryWords : [],
};


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
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem1, oVisitItem1), 0);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItem1), 0);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem1, oVisitItem2), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem2, oVisitItem1), 1 - 2/5);
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem2, oVisitItem3), 1);
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem1, oVisitItem3), 1);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem1, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonWords(oVisitItem2, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItemNull), 1);
  deepEqual(Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItemNull), 1);
});

