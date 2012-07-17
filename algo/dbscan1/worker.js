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
importScripts('../../lib/parse_url.js');

importScripts('../../init.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.algo.
importScripts('init.js');
importScripts('pre_treatment.js');
importScripts('distance.js');
importScripts('dbscan.js');

function handleVisitItems(lVisitItems) {
  /**
   * Loop through all the VisitItems and compute their distances to each other.
   * Keys are VisitItem ids.
   * Values are lists of couples with distances including the VisitItem.
   */

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = Cotton.Config.Parameters.fEps;
  // Min Points in a cluster
  var iMinPts = Cotton.Config.Parameters.iMinPts;

  // TOOLS
  lVisitItems = Cotton.Algo.PreTreatment.suite(lVisitItems);

  var iNbCluster = Cotton.Algo.DBSCAN(lVisitItems, fEps, iMinPts);

  /** This worker has no access to window or DOM. So update DOM should be done
   * in the main thread. */
  var dData = {};
  dData.iNbCluster = iNbCluster;
  dData.lVisitItems = lVisitItems;

  /** Send data to the main thread. Data are serialized */
  self.postMessage(dData);

  /** Terminates the worker */
  self.close();
}

self.addEventListener('message', function(e) {
  /**
   * Connect worker with main thread.
   * Worker starts when it receive postMessage().
   * Data received are serialized.
   * i.e. it's non Cotton.Model.VisitItem, but object.
   */
  handleVisitItems(e.data);
}, false);
