'use strict';

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
