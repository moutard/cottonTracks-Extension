'use strict';
/**
 * DBSCAN2 Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../../lib/class.js');
importScripts('../../../lib/underscore.min.js');

importScripts('../../init.js');

// Cotton.utils.
importScripts('../../utils/url_parser.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('../../algo/init.js');
importScripts('../../algo/dbscan/score/init.js');
importScripts('../../algo/dbscan/score/dbrecord_score.js');
importScripts('../../algo/dbscan/dbscan.js');
importScripts('../../algo/dbscan2/find_closest_google_search_page.js');

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
  var iMinPts = Cotton.Config.Parameters.dbscan2.iMinPts;

  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts,
      Cotton.Algo.Score.DBRecord.HistoryItem);

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
   handleHistoryItem(e.data['pool']);
}, false);
