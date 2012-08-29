'use strict';

/**
 * Given an array of visitItem labeled with a "clusterId", return a list of
 * list (cluster), that contains all visitItems with the same label.
 *
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Array.<Array.<visitItem>>} list of list that contains cluster.
 *
 */

Cotton.Algo.simpleCluster = function(lVisitItems, iNbCluster){
  var llClusters = [];

  // initialized
  for ( var i = 0; i < iNbCluster; i++) {
    llClusters[i] = [];
  }

  for ( var j = 0; j < lVisitItems.length; j++) {
      if (lVisitItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lVisitItems[j]['clusterId'] !== "NOISE") {
        llClusters[lVisitItems[j]['clusterId'] ].push(lVisitItems[j]);
      }
  }

  return _.reject(llClusters, function(lCluster) {
    return lCluster.length === 0;
  });

};

/**
 * Given an array of visitItem labeled with a "clusterId", return a list of
 * list (cluster), that contains all visitItems with the same label.
 *
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Array.<Array.<visitItem>>} list of list that contains cluster.
 *
 */

Cotton.Algo.elegantCuster = function(lVisitItems, iNbCluster){
  // TODO(rmoutard) : reject NOISE and UNCLASSIFIED
  return _.value(_.groupBy(lVisitItems, function(oItem){return oItem['clusterId'];}));
};
