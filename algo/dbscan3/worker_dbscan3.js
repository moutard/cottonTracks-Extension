'use strict';
/**
 * DBSCAN3 Worker
 *
 * Workers are in charge of parallelize tasks.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.min.js');

importScripts('../../init.js');
importScripts('../../utils/url_parser.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('../../algo/init.js');
importScripts('../../algo/common/init.js');
importScripts('../../algo/common/tools.js');
importScripts('../../algo/common/simple_cluster.js');
importScripts('../../algo/dbscan1/init.js');
importScripts('../../algo/dbscan1/pre_treatment.js');
importScripts('../../algo/dbscan1/distance.js');
importScripts('../../algo/dbscan1/dbscan.js');
importScripts('../../algo/dbscan3/detect_sessions.js');

function handleHistoryItems3(lHistoryItems) {
  /**
   * This method has 3 steps : - Separate Roughly the historyItems in sessions. -
   * Then compute for each rough sessions dbscan1 with distance only on the
   * time, to refine session. - For each session, compute dbscan1 with the
   * meaning distance.
   */

  // Max Distance between neighborhood.
  var fEps = Cotton.Config.Parameters.distanceMeaning.fEps;
  var fEpsTime = Cotton.Config.Parameters.distanceVisitTime.fEps;
  // Min Points in a cluster.
  var iMinPts = Cotton.Config.Parameters.distanceMeaning.iMinPts;
  var iMinPtsTime = Cotton.Config.Parameters.distanceVisitTime.iMinPts;

  // Applyed all the pretreatment first.
  //lHistoryItems = Cotton.Algo.PreTreatment.suite(lHistoryItems);

  // Step 1.
  Cotton.Algo.roughlySeparateSession(lHistoryItems, function(lSession) {

    // Do this for each session.

    // Step 2.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEpsTime, iMinPtsTime,
        Cotton.Algo.Distance.distanceVisitTime);

    // Cluster each session after a dbscan algorithm.
    var llClusters = Cotton.Algo.simpleCluster(lSession, iNbCluster);

    // For each session clustered by time, use DBSCAN1 with meaning distance.
    for ( var i = 0, iLength = llClusters.length; i < iLength; i++) {
      var lCluster = llClusters[i];

      // Step 3.
      var iNbSubCluster = Cotton.Algo.DBSCAN(lCluster, fEps, iMinPts,
          Cotton.Algo.Distance.meaning);

      var dData = {};
      dData['iNbCluster'] = iNbSubCluster;
      dData['lHistoryItems'] = lCluster;

      // Send data to the main thread. Data are serialized.
      self.postMessage(dData);

    }

    // Terminates the worker.
    self.close();

  });
}

self.addEventListener('message', function(e) {
  /**
   * Connect worker with main thread. Worker starts when it receive
   * postMessage(). Data received are serialized. i.e. it's non
   * Cotton.Model.HistoryItem, but object.
   */
  handleHistoryItems3(e.data);
}, false);
