'use strict';

var lOriginalVisitItems = [];
var lVisitItems = [];

module(
    "DBSCAN3",
    {
      setup : function() {
        // runs before each test

        lOriginalVisitItems = initlVisitItems();
      },
      teardown : function() {
        // runs after each test
      }
    });

test("Compute Cotton.Utils.preRemoveTools", function() {
  var iExpectedLengthAfter = 670;

  var lVisitItems = Cotton.Utils.preRemoveTools(lOriginalVisitItems);

  var sMessage = "Preremove tools has changed \n";
  sMessage  += "Expected Value is " + iExpectedLengthAfter
            + " but there are " + lVisitItems.length;
  equal(lVisitItems.length, iExpectedLengthAfter, sMessage);
});

test("Compute DBSCAN3", function() {

  var sMessage = "The value of the distance has changed \n";

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  // TOOLS
  lVisitItems = Cotton.Algo.PreTreatment.suite(lVisitItems);

  Cotton.Algo.roughlySeparateSession(lVisitItems, function(lSession) {
    // For each rough session, launch dbscan1.

    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);
    /**
     * This worker has no access to window or DOM. So update DOM should be done
     * in the main thread.
     */
    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lVisitItems'] = lSession;

    var dStories = Cotton.Algo.clusterStory(dData['lVisitItems'],
                                            dData['iNbCluster']);

  });

});

test("second test within module", function() {
  ok(true, "all pass");
});

