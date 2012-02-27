'use strict';

importScripts('../init.js');
importScripts('__init__.js');
importScripts('historyItemsClass.js');
importScripts('toolsClass.js');
importScripts('preTreatment.js');
importScripts('distance.js');
importScripts('dbscan.js');
importScripts('historyItemsClass.js');
importScripts('toolsClass.js');

importScripts('../lib/underscore.js');
importScripts('../lib/parseURL.js');

var single;

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
  lHistoryItems = Cotton.Algo.removeTools(lHistoryItems);
  lHistoryItems = Cotton.Algo.computeClosestGeneratedPage(lHistoryItems);

  single = HistoryItemsSingleton.getInstance(lHistoryItems);
  var iNbCluster = Cotton.Algo.DBSCAN(lHistoryItems, fEps, iMinPts);
  
  // Format the result data and send it to the main thread
  // This worker has no access to window or DOM. So update DOM
  // should be done in the main thread
  var data = {};
  data.iNbCluster = iNbCluster;
  data.lHistoryItems = lHistoryItems;
  self.postMessage(data);

  self.close(); // Terminates the worker.
}

// connect worker with main thread
self.addEventListener('message', function(e){
  // Worker starts when it receive postMessage() 
  handleVisitItems(e.data);
}, false);

