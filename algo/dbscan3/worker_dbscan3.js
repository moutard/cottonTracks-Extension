'use strict';
/**
 * DBSCAN3 Worker
 *
 * Workers are in charge of parallelize tasks.
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
   * This method has 3 steps :
   * - Separate Roughly the visitItems in sessions.
   * - Then compute for each rough sessions dbscan1 with distance only
   * on the time, to refine session.
   * - For each session, compute dbscan1 with the meaning distance.
   */

  // Max Distance between neighborhood.
  var fEps = Cotton.Config.Parameters.distanceMeaning.fEps;
  var fEpsTime =  Cotton.Config.Parameters.distanceVisitTime.fEps;
  // Min Points in a cluster.
  var iMinPts = Cotton.Config.Parameters.distanceMeaning.iMinPts;
  var iMinPtsTime = Cotton.Config.Parameters.distanceVisitTime.iMinPts;

  // Applyed all the pretreatment first.
  lVisitItems = Cotton.Algo.PreTreatment.suite(lVisitItems);


  // Step 1.
  Cotton.Algo.roughlySeparateSession(lVisitItems, function(lSession) {

    // Do this for each session.

    // Step 2.
    var iNbCluster = Cotton.Algo.DBSCAN(lSession, fEpsTime, iMinPtsTime,
      Cotton.Algo.Distance.distanceVisitTime
    );

    // Cluster each session after a dbscan algorithm.
    var llClusters = Cotton.Algo.simpleCuster(lSession, iNbCluster);

    // For each session clustered by time, use DBSCAN1 with meaning distance.
    for(var i = 0; i < llClusters.length; i++){
      var lCluster = llClusters[i];

      // Step 3.
      var iNbSubCluster = Cotton.Algo.DBSCAN(lCluster, fEps, iMinPts,
        Cotton.Algo.Distance.meaning);

      var dData = {};
      dData['iNbCluster'] = iNbSubCluster
      dData['lVisitItems'] = lCluster;

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
   * Cotton.Model.VisitItem, but object.
   */
  handleVisitItems3(e.data);
}, false);
