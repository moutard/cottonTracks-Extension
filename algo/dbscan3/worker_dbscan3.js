'use strict';
/**
 * DBSCAN3 Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.js');
importScripts('../../lib/parse_url.js');

importScripts('../../init.js');

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
importScripts('../../algo/dbscan3/detect_sessions.js');

function handleVisitItems3(lVisitItems) {
  /**
   * This method has 3 steps : - Separate Roughly the visitItems in sessions. -
   * (OPTIONAL) Then compute for each rough sessions dbscan1 with distance only
   * on the time. to refine session. - For each session, compute dbscan1.
   */

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  // TOOLS
  lVisitItems = Cotton.Algo.PreTreatment.suite(lVisitItems);

  Cotton.Algo.roughlySeparateSession(lVisitItems, function(lSession) {
    // For each rough session, launch dbscan1.

    // TODO(rmoutard) : Maybe create a worker, by session. or use a queue.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);
    /**
     * This worker has no access to window or DOM. So update DOM should be done
     * in the main thread.
     */
    var dData = {};
    dData['iNbCluster'] = iNbCluster;
    dData['lVisitItems'] = lSession;

    /** Send data to the main thread. Data are serialized */
    self.postMessage(dData);
  });

  /** Terminates the worker */
  self.close();
}

self.addEventListener('message', function(e) {
  /**
   * Connect worker with main thread. Worker starts when it receive
   * postMessage(). Data received are serialized. i.e. it's non
   * Cotton.Model.VisitItem, but object.
   */
  handleVisitItems3(e.data);
}, false);
