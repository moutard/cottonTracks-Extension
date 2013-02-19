'use strict';
var oVisitItem1 = {
  lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
  lQueryWords : ['alice', 'wonderland', 'film'],
};

var oVisitItem2 = {
  lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll'],
  lQueryWords : ['alice', 'wonderland', 'novel'],
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
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem1, oVisitItem1), 0);
});

test("Cotton.Algo.Distance - distance meaning.", function() {
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem1, oVisitItem2), 1);
  deepEqual(Cotton.Algo.Distance.meaning(oVisitItem2, oVisitItem1), 1);
});

