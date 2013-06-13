'use strict';
Cotton.Test.Data.Distance = {};

module(
    "Cotton.Algo.Score",
    {
      'setup' : function() {
        Cotton.Test.Data.Distance.dHistoryItem1 = {
          'oExtractedDNA' : {
            'dBagOfWords' : {'alice':3, 'wonderland':3, 'movie':3, 'burton':3, 'tim':3, 'novel':3},
          }
        };

        Cotton.Test.Data.Distance.dHistoryItem2 = {
          'oExtractedDNA' : {
            'dBagOfWords' : {'alice':3, 'wonderland':3, 'novel':3, 'lewis':3, 'caroll':3},
          }
        };

      },
      'teardown' : function() {
        // runs after each test
      }
    }
);


test("score BagOfWords.", function() {
  deepEqual(Cotton.Algo.Score.DBRecord.BagOfWords({foo: 3}, {}), 0);
  deepEqual(Cotton.Algo.Score.DBRecord.BagOfWords({foo: 4}, {foo:3}), 12);
  deepEqual(Cotton.Algo.Score.DBRecord.BagOfWords({foo: 4, bar: 1}, {foo:3}), 12);
  deepEqual(Cotton.Algo.Score.DBRecord.BagOfWords({foo: 4, bar: 1}, {foo:3, bar:4}), 16);
});

test("score same HistoryItem.", function() {
  deepEqual(Cotton.Algo.Score.DBRecord.HistoryItem(
      Cotton.Test.Data.Distance.dHistoryItem1,
      Cotton.Test.Data.Distance.dHistoryItem1), 54);
});

test("score HistoryItem.", function() {
  deepEqual(Cotton.Algo.Score.DBRecord.HistoryItem(
      Cotton.Test.Data.Distance.dHistoryItem1,
      Cotton.Test.Data.Distance.dHistoryItem2), 27);
});

