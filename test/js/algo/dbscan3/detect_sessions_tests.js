module(
    "Cotton.Algo.DBSCAN3",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);

test('detect session.', function() {
  var lSampleHistoryItems = japan;
  var lExepctedResult = [1, 8, 18, 7];
  var iSessionId = 0;
  Cotton.Algo.roughlySeparateSession(lSampleHistoryItems,
    function(lNewRoughSession){
      equal(lNewRoughSession.length, lExepctedResult[iSessionId]);
      iSessionId += 1;
  });
});

