'use strict';

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


test("Cotton.Algo.Distance.meaning", function() {
  var fExpectedDistance = 670;

  var fDistance = Cotton.Algo.Distance.meaning(lVisitItems[0], lVisitItems[1]);

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


