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

test('detect session for visititems.', function() {
  var lSampleHistoryItems = chrome_visit_source_green.slice();
  lSampleHistoryItems.sort(function(a,b){
    return b['lastVisitTime'] - a['lastVisitTime'];
  });
  console.log(lSampleHistoryItems);
  var iSessionId = 0;
  Cotton.Algo.roughlySeparateSession(lSampleHistoryItems,
    function(lNewRoughSession){
      if(lNewRoughSession.length < 10) {
        console.log("A session with length < 10:");
        console.log(lNewRoughSession);
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
  console.log('HADRIEN');
  var lSampleHistoryItems = cotton_history_source_hadrien;
  // FIXME(rmoutard): ask hadrien to do it's file again so we don't need
  // this line again.
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
test("algo of dbscan3 worker for hadrien WITH COSINE with very high fEps (200)", function() {
  console.log('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  console.log("Start with chrome raw history that contains elements :");
  console.log(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  console.log("After pre treatment history that contains elements :");
  console.log(lHistoryItems.length);

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
  console.log(dStories);
  equal(iNbCluster, 1);
  equal(dStories[0].length, 79);

});
test("algo of dbscan3 worker for hadrien WITH COSINE with very small fEps (10)", function() {
  console.log('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  console.log("Start with chrome raw history that contains elements :");
  console.log(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  console.log("After pre treatment history that contains elements :");
  console.log(lHistoryItems.length);

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
  console.log(dStories);
  equal(iNbCluster, 0);

});
test("algo of dbscan3 worker for hadrien WITH COSINE with very small fEps (10)", function() {
  console.log('HADRIEN');

  // Take the chrome history raw.
  var lSampleHistoryItems = chrome_history_source_foot;

  console.log("Start with chrome raw history that contains elements :");
  console.log(lSampleHistoryItems.length);
  // Make pretreatment and translate into cotton history item.
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

  console.log("After pre treatment history that contains elements :");
  console.log(lHistoryItems.length);

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
  console.log(dStories);
  equal(iNbCluster, 1);
  equal(dStories[0].length, 30);

});


test("algo of dbscan3 worker for small cluster", function() {
  console.log('small cluster');

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
    console.log(dStories);
    equal(iNbCluster, 0);

  });

});

/*
test("algo of dbscan3 worker for hadrien WITH COSINE", function() {
  console.log('HADRIEN');
  var lSampleHistoryItems = cotton_history_source_hadrien;
  // FIXME(rmoutard): ask hadrien to do it's file again so we don't need
  // this line again.
  var lHistoryItems = Cotton.Algo.PreTreatment.suite(lSampleHistoryItems);

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 20;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

     // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.Distance.CosineHistoryItem);
  //
  // This worker has no access to window or DOM. So update DOM should be done
  // in the main thread.

  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lHistoryItems;
  var dStories = Cotton.Algo.clusterStory(dData['lHistoryItems'],
                                          dData['iNbCluster']);
  console.log('PP');
  console.log(dStories);
  equal(iNbCluster, 0);

});
*/
/*
test("algo of dbscan3 worker for hadrien.", function() {
  var lSampleHistoryItems = chrome_history_source_hadrien;
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);

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
