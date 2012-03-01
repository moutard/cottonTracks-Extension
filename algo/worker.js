'use strict';

// Worker has no access to external librairies loaded in the main thread.
/// Cotton.lib.
importScripts('../lib/underscore.js');
importScripts('../lib/parseURL.js');
// Cotton.Algo.
importScripts('../init.js');
importScripts('init.js');
importScripts('historyItemsClass.js');
importScripts('toolsClass.js');
importScripts('preTreatment.js');
importScripts('distance.js');
importScripts('dbscan.js');
importScripts('historyItemsClass.js');
importScripts('toolsClass.js');

var oHistoryItemsSingleton;

function handleVisitItems(lHistoryItems) {
  // Loop through all the VisitItems and compute their distances to each other.
  // Keys are VisitItem ids.
  // Values are lists of couples with distances including the VisitItem.

  // PARAMETERS
  // Max Distance between neighborhood
  var fEps = 70000.0;
  // Min Points in a cluster
  var iMinPts = 5;

  // TOOLS
  // TODO(rmoutard) : for the moment afectation is needed
  // remove afectation lHistoryITems is passed by reference
  lHistoryItems = Cotton.Algo.removeTools(lHistoryItems);
  lHistoryItems = Cotton.Algo.computeClosestGeneratedPage(lHistoryItems);

  oHistoryItemsSingleton = HistoryItemsSingleton.getInstance(lHistoryItems);
  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts);

  // This worker has no access to window or DOM. So update DOM should be done
  // in the main thread.
  var dData = {};
  dData.iNbCluster = iNbCluster;
  dData.lHistoryItems = lHistoryItems;

  self.postMessage(dData); // Send data to the main thread
  self.close(); // Terminates the worker.
}

self.addEventListener('message', function(e) {
  // Connect worker with main thread.

  // Worker starts when it receive postMessage().
  handleVisitItems(e.data);
}, false);
