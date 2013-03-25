'use strict';

/**
 * Setup all variables once before all the tests. For the moment we don't need
 * to setup before each test.
 */

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

test("algo of dbscan3 worker.", function() {
  var lSampleHistoryItems = japan;
  var lHistoryItems = Cotton.Algo.PreTreatment.suite(lSampleHistoryItems);

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  Cotton.Algo.roughlySeparateSession(lHistoryItems, function(lSession) {
    // For each rough session, launch dbscan1.
    console.log("New session : " + lSession.length);
    console.log(lSession);
    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);
    /**
     * This worker has no access to window or DOM. So update DOM should be done
     * in the main thread.
     */
    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lHistoryItems'] = lSession;

    equal(iNbCluster, 0);
  });

});
/*
test("algo of dbscan3 worker for hadrien.", function() {
  var lSampleHistoryItems = hadrien_source;
  var lHistoryItems = Cotton.Algo.PreTreatment.suite(lSampleHistoryItems);

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  Cotton.Algo.roughlySeparateSession(lHistoryItems, function(lSession) {
    // For each rough session, launch dbscan1.
    console.log("New session : " + lSession.length);
    console.log(lSession);
    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);
    //
    // This worker has no access to window or DOM. So update DOM should be done
    // in the main thread.

    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lHistoryItems'] = lSession;

    equal(iNbCluster, 0);
  });

});
*/
