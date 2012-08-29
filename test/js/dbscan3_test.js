'use strict';

/**
 * Setup all variables once before all the tests. For the moment we don't need
 * to setup before each test.
 */
var lSampleHistoryItems = initlHistoryItems();
var lHistoryItems = [];
var lVisitItems = [];
// runs before each test
lHistoryItems = Cotton.Utils.preRemoveTools(lSampleHistoryItems);

// Simutate store in the DB
for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
  var oVisitItem = new Cotton.Model.VisitItem();

  oVisitItem._sUrl = oHistoryItem.url;
  oVisitItem._sTitle = oHistoryItem.title || '';
  oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;
  lVisitItems.push(oVisitItem);
}

// Simulate get oVisitItem from the DB but,
// send to the worker a list of serialized visitItem
var lAllVisitDict = [];
for(var i = 0, oItem; oItem = lVisitItems[i]; i++){
  // maybe a setFormatVersion problem
  var oTranslator = Cotton.Translators.VISIT_ITEM_TRANSLATORS[Cotton.Translators.VISIT_ITEM_TRANSLATORS.length - 1];
  var dItem = oTranslator.objectToDbRecord(oItem);
  lAllVisitDict.push(dItem);
}
lVisitItems = Cotton.Algo.PreTreatment.suite(lAllVisitDict);

module(
    "DBSCAN3",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("Cotton.Algo.Distance.meaning - Test maximum distance", function() {
  var fExpectedDistance = 1;

  var fDistance = Cotton.Algo.Distance.meaning(lVisitItems[0], lVisitItems[1]);

  var sMessage = "Cotton.Algo.Distance.meaning has changed \n";
  sMessage  += "Expected Value is " + fExpectedDistance
            + " but there are " + fDistance;
  equal(fDistance, fExpectedDistance, sMessage);

});

test("Cotton.Algo.Distance.meaning - Test minimal distance", function() {
  var fExpectedDistance = 0.3;

  var fDistance = Cotton.Algo.Distance.meaning(lVisitItems[1], lVisitItems[1]);

  var sMessage = "Cotton.Algo.Distance.meaning has changed \n";
  sMessage  += "Expected Value is " + fExpectedDistance
            + " but there are " + fDistance;
  equal(fDistance, fExpectedDistance, sMessage);

});


test("Cotton.Algo.DBSCAN3", function() {

  var sMessage = "The value of the distance has changed \n";

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  Cotton.Algo.roughlySeparateSession(lVisitItems, function(lSession) {
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
    dData['lVisitItems'] = lSession;

    var dStories = Cotton.Algo.clusterStory(dData['lVisitItems'],
                                            dData['iNbCluster']);
  });

});

test("Cotton.Algo.DBSCAN3 : improvement", function() {

  var sMessage = "The value of the distance has changed \n";

  // Max Distance between neighborhood.
  var fEps = Cotton.Config.Parameters.distanceMeaning.fEps;
  var fEpsTime =  Cotton.Config.Parameters.distanceVisitTime.fEps;
  // Min Points in a cluster.
  var iMinPts = Cotton.Config.Parameters.distanceMeaning.iMinPts;
  var iMinPtsTime = Cotton.Config.Parameters.distanceVisitTime.iMinPts;

  Cotton.Algo.roughlySeparateSession(lVisitItems, function(lSession) {
    // For each rough session, launch dbscan1.
    console.log("New session : " + lSession.length);
    console.log(lSession);
    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEpsTime, iMinPtsTime,
        Cotton.Algo.Distance.distanceVisitTime);

    var llClusters = Cotton.Algo.simpleCluster(lSession, iNbCluster);

    for(var i = 0; i < llClusters.length; i++){
      var lCluster = llClusters[i];
      console.log("New sub-session : " + lCluster.length);
      console.log(lCluster);
      var iNbSubCluster = Cotton.Algo.DBSCAN(lCluster, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);

      var dData = {};
      dData['iNbCluster'] = iNbSubCluster
      dData['lVisitItems'] = lCluster;

      var dStories = Cotton.Algo.clusterStory(  dData['lVisitItems'],
                                                dData['iNbCluster']);
    }
  });

});


