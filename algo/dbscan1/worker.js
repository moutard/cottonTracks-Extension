'use strict';
/**
 * DBSCAN1 Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.js');

importScripts('../../init.js');
importScripts('../../lib/url_parser.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('../../algo/init.js');
importScripts('../../algo/common/init.js');
importScripts('../../algo/common/tools.js');
importScripts('../../algo/dbscan1/init.js');
importScripts('../../algo/dbscan1/pre_treatment.js');
importScripts('../../algo/dbscan1/distance.js');
importScripts('../../algo/dbscan1/dbscan.js');

function handleHistoryItems(lHistoryItems) {
  /**
   * Loop through all the HistoryItems and compute their distances to each other.
   * Keys are HistoryItem ids. Values are lists of couples with distances
   * including the HistoryItem.
   */

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.dbscan3.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  // TOOLS
  lHistoryItems = Cotton.Algo.PreTreatment.suite(lHistoryItems);

  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.distanceComplexe);

  /**
   * This worker has no access to window or DOM. So update DOM should be done in
   * the main thread.
   */
  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lHistoryItems;

  /** Send data to the main thread. Data are serialized */
  self.postMessage(dData);

  /** Terminates the worker */
  self.close();
}

self.addEventListener('message', function(e) {
  /**
   * Connect worker with main thread. Worker starts when it receive
   * postMessage(). Data received are serialized. i.e. it's non
   * Cotton.Model.HistoryItem, but object.
   */
  handleHistoryItems(e.data);
}, false);
