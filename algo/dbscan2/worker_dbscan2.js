'use strict';
/**
 * DBSCAN2 Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.min.js');

importScripts('../../init.js');

importScripts('../../utils/init.js');
importScripts('../../utils/url_parser.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('../../algo/init.js');
importScripts('../../algo/common/init.js');
importScripts('../../algo/common/tools.js');
importScripts('../../algo/dbscan1/distance.js');
importScripts('../../algo/dbscan1/dbscan.js');
importScripts('../../algo/dbscan1/pre_treatment.js');
importScripts('../../algo/dbscan2/init.js');

/**
 * Loop through all the HistoryItems and compute their distances to each other.
 * Keys are HistoryItem ids. Values are lists of couples with distances
 * including the HistoryItem.
 */
function handleHistoryItem(lHistoryItems) {

  // PARAMETERS
  // Max Distance between neighborhood.
  var fEps = Cotton.Config.Parameters.dbscan2.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  // TOOLS
  lHistoryItems = Cotton.Algo.PreTreatment.suite(lHistoryItems);

  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.Distance.meaning);

  var dData = {};
  dData['iNbCluster'] = iNbCluster;
  dData['lHistoryItems'] = lHistoryItems;

  // Send data to the main thread. Data are serialized.
  self.postMessage(dData);

  // Terminates the worker
  self.close();
}

/**
 * Connect worker with main thread. Worker starts when it receive
 * postMessage(). Data received are serialized. i.e. it's non
 * Cotton.Model.HistoryItem, but object.
 */
self.addEventListener('message', function(e) {
   handleHistoryItem(e.data);
}, false);
