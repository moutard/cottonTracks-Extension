'use strict';
/**
 * DBSCAN3 Worker
 *
 * Workers are in charge of parallelize tasks.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../../lib/class.js');

importScripts('../../init.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('../../algo/init.js');
importScripts('../../algo/dbscan/score/init.js');
importScripts('../../algo/dbscan/score/dbrecord_score.js');
importScripts('../../algo/dbscan/dbscan.js');
importScripts('../../algo/dbscan3/detect_sessions.js');

/**
 * This method has 3 steps : - Separate Roughly the historyItems in sessions. -
 * Then compute for each rough sessions dbscan with distance only on the
 * time, to refine session. - For each session, compute dbscan with the
 * meaning distance.
 */
function handleHistoryItems3(lHistoryItems, lVisitItems) {

  // Max Distance between neighborhood.
  var fEps = Cotton.Config.Parameters.dbscan3.fEps;
  // Min Points in a cluster.
  var iMinPts = Cotton.Config.Parameters.dbscan3.iMinPts;

  // Pretreatment suite has already been applied

  // Step 1.
  Cotton.Algo.roughlySeparateSessionForVisitItems(lHistoryItems, lVisitItems,
    function(lSession, iTotalSessions) {
    if (iTotalSessions) {
      self.postMessage({'iTotalSessions' : iTotalSessions});
    }
    // Do this for each session.

    // Step 2.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Score.DBRecord.HistoryItem);

    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lHistoryItems'] = lSession;

    // Send data to the main thread. Data are serialized.
    self.postMessage(dData);

    // Terminates the worker.
    self.close();

  });
}

/**
 * Connect worker with main thread. Worker starts when it receive
 * postMessage(). Data received are serialized. i.e. it's non
 * Cotton.Model.HistoryItem, but object.
 */
self.addEventListener('message', function(e) {
  handleHistoryItems3(e.data['historyItems'], e.data['visitItems']);
}, false);
