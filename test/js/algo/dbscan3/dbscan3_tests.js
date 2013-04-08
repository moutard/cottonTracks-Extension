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

/**
 * Given an array of historyItems labeled with a "clusterId", return a list of
 * list (cluster), that contains all historyItems with the same label.
 *
 * @param {Array.
 *          <Object>} lHistoryItems : array of DbRecordhistoryItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Array.<Array.<historyItem>>} list of list that contains cluster.
 *
 */

Cotton.Algo.simpleCluster = function(lHistoryItems, iNbCluster){
  var llClusters = [];

  // initialized
  for ( var i = 0; i < iNbCluster; i++) {
    llClusters[i] = [];
  }

  for ( var j = 0, iLength = lHistoryItems.length; j < iLength; j++) {
      if (lHistoryItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lHistoryItems[j]['clusterId'] !== "NOISE") {
        llClusters[lHistoryItems[j]['clusterId'] ].push(lHistoryItems[j]);
      }
  }

  return _.reject(llClusters, function(lCluster) {
    return lCluster.length === 0;
  });

};
test('detect session for visititems.', function() {
  var lSampleHistoryItems = chrome_visit_source_green.slice();
  lSampleHistoryItems.sort(function(a,b){
    return b['lastVisitTime'] - a['lastVisitTime'];
  });
  DEBUG && console.debug(lSampleHistoryItems);
  var iSessionId = 0;
  Cotton.Algo.roughlySeparateSession(lSampleHistoryItems,
    function(lNewRoughSession){
      if(lNewRoughSession.length < 10) {
        DEBUG && console.debug("A session with length < 10:");
        DEBUG && console.debug(lNewRoughSession);
        iSessionId += 1;
      }
      ok((iSessionId < 30), iSessionId + ' ' + lNewRoughSession.length);
  });
});

test("algo of dbscan3 worker.", function() {
  var lSampleHistoryItems = cotton_history_source_japan;
  var lHistoryItems = Cotton.Algo.PreTreatment.suite(lSampleHistoryItems);

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.dbscan3.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  Cotton.Algo.roughlySeparateSession(lHistoryItems, function(lSession) {
    // For each rough session, launch dbscan1.
    DEBUG && console.debug("New session : " + lSession.length);
    DEBUG && console.debug(lSession);
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

test("algo of dbscan3 worker for hadrien WITH COSINE with very high fEps (200)", function() {
  DEBUG && console.debug('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  DEBUG && console.debug("Start with chrome raw history that contains elements :");
  DEBUG && console.debug(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  DEBUG && console.debug("After pre treatment history that contains elements :");
  DEBUG && console.debug(lHistoryItems.length);

  // Do not really populate db.

  // As the dbscan is launch in a worker we need to serialize data.
  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
  var lSerializedHistoryItems = [];
  for(var i = 0, oIDBHistoryItem; oIDBHistoryItem = lHistoryItems[i]; i++) {
    lSerializedHistoryItems.push(oTranslator.objectToDbRecord(oIDBHistoryItem));
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 200;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lSerializedHistoryItems, fEps, iMinPts,
      Cotton.Algo.Distance.CosineHistoryItem);
  //
  // This worker has no access to window or DOM. So update DOM should be done
  // in the main thread.

  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lSerializedHistoryItems;
  // because we don't have visittime for this example use simple cluster.
  var dStories = Cotton.Algo.simpleCluster(dData['lHistoryItems'],
                                          dData['iNbCluster']);
  DEBUG && console.debug(dStories);
  equal(iNbCluster, 1);
  equal(dStories[0].length, 79);

});
test("algo of dbscan3 worker for hadrien WITH COSINE with very small fEps (10)", function() {
  DEBUG && console.debug('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  DEBUG && console.debug("Start with chrome raw history that contains elements :");
  DEBUG && console.debug(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  DEBUG && console.debug("After pre treatment history that contains elements :");
  DEBUG && console.debug(lHistoryItems.length);

  // Do not really populate db.

  // As the dbscan is launch in a worker we need to serialize data.
  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
  var lSerializedHistoryItems = [];
  for(var i = 0, oIDBHistoryItem; oIDBHistoryItem = lHistoryItems[i]; i++) {
    lSerializedHistoryItems.push(oTranslator.objectToDbRecord(oIDBHistoryItem));
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 10;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lSerializedHistoryItems, fEps, iMinPts,
      Cotton.Algo.Distance.CosineHistoryItem);
  //
  // This worker has no access to window or DOM. So update DOM should be done
  // in the main thread.

  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lSerializedHistoryItems;
  // because we don't have visittime for this example use simple cluster.
  var dStories = Cotton.Algo.simpleCluster(dData['lHistoryItems'],
                                          dData['iNbCluster']);
  DEBUG && console.debug(dStories);
  equal(iNbCluster, 0);

});
test("algo of dbscan3 worker for hadrien WITH COSINE with very small fEps (10)", function() {
  DEBUG && console.debug('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  DEBUG && console.debug("Start with chrome raw history that contains elements :");
  DEBUG && console.debug(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  DEBUG && console.debug("After pre treatment history that contains elements :");
  DEBUG && console.debug(lHistoryItems.length);

  // Do not really populate db.

  // As the dbscan is launch in a worker we need to serialize data.
  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
  var lSerializedHistoryItems = [];
  for(var i = 0, oIDBHistoryItem; oIDBHistoryItem = lHistoryItems[i]; i++) {
    lSerializedHistoryItems.push(oTranslator.objectToDbRecord(oIDBHistoryItem));
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 50;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lSerializedHistoryItems, fEps, iMinPts,
      Cotton.Algo.Distance.CosineHistoryItem);
  //
  // This worker has no access to window or DOM. So update DOM should be done
  // in the main thread.

  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lSerializedHistoryItems;
  // because we don't have visittime for this example use simple cluster.
  var dStories = Cotton.Algo.simpleCluster(dData['lHistoryItems'],
                                          dData['iNbCluster']);
  DEBUG && console.debug(dStories);
  equal(iNbCluster, 1);
  equal(dStories[0].length, 30);

});


test("algo of dbscan3 worker for small cluster", function() {
  DEBUG && console.debug('small cluster');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_hadrien.slice();

  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  // Do not populate db but put id.

  // As the dbscan is launch in a worker we need to serialize data.
  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
  var lSerializedHistoryItems = [];
  for(var i = 0, oIDBHistoryItem; oIDBHistoryItem = lHistoryItems[i]; i++) {
    oIDBHistoryItem.initId(lSampleHistoryItems[i]['id']);
    lSerializedHistoryItems.push(oTranslator.objectToDbRecord(oIDBHistoryItem));
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 18;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  Cotton.Algo.cutInEqualCluster(200, lSerializedHistoryItems, function(lSession){
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
      Cotton.Algo.Distance.CosineHistoryItem);
    //
    // This worker has no access to window or DOM. So update DOM should be done
    // in the main thread.

    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lHistoryItems'] = lSession;
    var dStories = Cotton.Algo.clusterStory(dData['lHistoryItems'],
                                            dData['iNbCluster']);
    DEBUG && console.debug(dStories);
    equal(iNbCluster, 0);

  });

});
