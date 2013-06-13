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

test("algo of dbscan3 worker for hadrien with very low fEps (0)", function() {

  var lSampleHistoryItems = cotton_history_source_hadrien;

  // we need oHistoryItems objects to compute bagOfWords

  var lHistoryItems = [];
  for (var i = 0, dHistoryItem; dHistoryItem = lSampleHistoryItems[i]; i++){
    lHistoryItems.push(new Cotton.Model.HistoryItem(dHistoryItem));
  }
  lHistoryItems = Cotton.DB.Populate.computeBagOfWordsForHistoryItemsList(lHistoryItems);
  lHistoryItems = Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords(lHistoryItems);
  // then back to dictionaries for the algo, just like in the worker
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    lHistoryItems[i] = oHistoryItem.dbRecord();
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

  var lHistoryItems = [];
  for (var i = 0, dHistoryItem; dHistoryItem = lSampleHistoryItems[i]; i++){
    lHistoryItems.push(new Cotton.Model.HistoryItem(dHistoryItem));
  }
  lHistoryItems = Cotton.DB.Populate.computeBagOfWordsForHistoryItemsList(lHistoryItems);
  lHistoryItems = Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords(lHistoryItems);
  // then back to dictionaries for the algo, just like in the worker
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    lHistoryItems[i] = oHistoryItem.dbRecord();
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
