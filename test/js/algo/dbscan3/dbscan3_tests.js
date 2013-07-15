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
  var lSampleVisitItems = chrome_visit_source_green.slice();
  lSampleVisitItems.sort(function(a,b){
    return b['lastVisitTime'] - a['lastVisitTime'];
  });
  DEBUG && console.debug(lSampleVisitItems);
  var iSessionId = 0;
  Cotton.Algo.roughlySeparateSession(lSampleVisitItems,
    function(lNewRoughSession){
      if(lNewRoughSession.length < 10) {
        DEBUG && console.debug("A session with length < 10:");
        DEBUG && console.debug(lNewRoughSession);
        iSessionId += 1;
      }
      ok((iSessionId < 40), iSessionId + ' ' + lNewRoughSession.length);
  });
});

test("algo of dbscan3 worker.", function() {
  var lSampleHistoryItems = cotton_history_source_hadrien;

  // we need oHistoryItems objects to compute bagOfWords
  var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
  var oTranslator = lTranslators[lTranslators.length - 1];

  var lHistoryItems = [];
  for (var i = 0, dHistoryItem; dHistoryItem = lSampleHistoryItems[i]; i++){
    lHistoryItems.push(oTranslator._mDbRecordToObjectConverter(dHistoryItem));
  }
  lHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lHistoryItems);
  lHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lHistoryItems);
  // then back to dictionaries for the algo, just like in the worker
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    lHistoryItems[i] = oTranslator._mObjectToDbRecordConverter(oHistoryItem);
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.dbscan3.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.dbscan3.iMinPts;

  Cotton.Algo.roughlySeparateSession(lHistoryItems, function(lSession) {
    // For each rough session, launch dbscan1.
    DEBUG && console.debug("New session : " + lSession.length);
    DEBUG && console.debug(lSession);
    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Score.DBRecord.HistoryItem);
    /**
     * This worker has no access to window or DOM. So update DOM should be done
     * in the main thread.
     */
    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lHistoryItems'] = lSession;

    ok(true, "dbscan3 runs");
  });

});

test("algo of dbscan3 worker for hadrien with very low fEps (0)", function() {

  var lSampleHistoryItems = cotton_history_source_hadrien;

  // we need oHistoryItems objects to compute bagOfWords
  var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
  var oTranslator = lTranslators[lTranslators.length - 1];

  var lHistoryItems = [];
  for (var i = 0, dHistoryItem; dHistoryItem = lSampleHistoryItems[i]; i++){
    lHistoryItems.push(oTranslator._mDbRecordToObjectConverter(dHistoryItem));
  }
  lHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lHistoryItems);
  lHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lHistoryItems);
  // then back to dictionaries for the algo, just like in the worker
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    lHistoryItems[i] = oTranslator._mObjectToDbRecordConverter(oHistoryItem);
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 0;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.dbscan3.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.Score.DBRecord.HistoryItem);
  /**
   * This worker has no access to window or DOM. So update DOM should be done
   * in the main thread.
   */
  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lHistoryItems;

  var dStories = Cotton.Algo.simpleCluster(dData['lHistoryItems'],
                                          dData['iNbCluster']);

  DEBUG && console.debug(dStories);
  equal(iNbCluster, 1);
  equal(dStories[0].length, lHistoryItems.length);
});

test("algo of dbscan3 worker for hadrien with high fEps (200)", function() {

  var lSampleHistoryItems = cotton_history_source_hadrien;

  // we need oHistoryItems objects to compute bagOfWords
  var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
  var oTranslator = lTranslators[lTranslators.length - 1];

  var lHistoryItems = [];
  for (var i = 0, dHistoryItem; dHistoryItem = lSampleHistoryItems[i]; i++){
    lHistoryItems.push(oTranslator._mDbRecordToObjectConverter(dHistoryItem));
  }
  lHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lHistoryItems);
  lHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lHistoryItems);
  // then back to dictionaries for the algo, just like in the worker
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    lHistoryItems[i] = oTranslator._mObjectToDbRecordConverter(oHistoryItem);
  }
  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 200;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.dbscan3.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.Score.DBRecord.HistoryItem);
  /**
   * This worker has no access to window or DOM. So update DOM should be done
   * in the main thread.
   */
  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lHistoryItems;

  var dStories = Cotton.Algo.simpleCluster(dData['lHistoryItems'],
                                          dData['iNbCluster']);

  DEBUG && console.debug(dStories);
  equal(iNbCluster, 0);
  equal(dStories.length, 0);
});
