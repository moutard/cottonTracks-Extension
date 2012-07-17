'use strict';
// Disclaimer : this file is just a draft to visualize easily result from the
// algo

function handleResultsOfFirstDBSCAN(iNbCluster, lVisitItems) {

  var dStories = Cotton.Algo.clusterStory(lVisitItems, iNbCluster);
  // var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);
  var bUseRelevance = Cotton.Config.Parameters.bUseRelevance;

  // UI
  $('#loader-animation').remove();
  Cotton.UI.Debug.displayStory(dStories.storyUnderConstruction);
  Cotton.UI.Debug.displayStories(dStories.stories);

  // DB
  // Cotton.DB.ManagementTools.addHistoryItems(lHistoryItems);
  Cotton.DB.ManagementTools.addStoriesByChronology(dStories.stories);
}

// WORKER
// DBSCAN is lauched in a worker used as multithread.
var wDBSCAN = new Worker('algo/worker.js');

wDBSCAN.addEventListener('message', function(e) {
  // Is called when a message is sent by the worker.
  Cotton.UI.openCurtain();
  // Use local storage, to see that's it's not the first visit.
  localStorage['CottonFirstOpening'] = "false";
  console.log('Worker ends: ', e.data.iNbCluster);
  handleResultsOfFirstDBSCAN(e.data.iNbCluster, e.data.lVisitItems);

}, false);

/*
 * // START if (localStorage) { // Check if broswer support localStorage //
 * ct-dev-env is used to dev purpose. Remove this line for user version.
 * localStorage['ct-dev-env'] = true;
 * 
 * if (localStorage['CottonFirstOpening'] === undefined ||
 * localStorage['CottonFirstOpening'] === "true") { // This is the first visit. //
 * CT-DEV-ENV if (localStorage['ct-dev-env'] === true) { // In ct-dev-en delete
 * the database. var oDeleteRequest =
 * window.webkitIndexedDB.deleteDatabase('ct');
 * 
 * oDeleteRequest.onsuccess = function(event) { // After deleting database
 * create a new one. Cotton.DB.populateDB(function() { var oStore = new
 * Cotton.DB.Store('ct', { 'visitItems' :
 * Cotton.Translators.VISIT_ITEM_TRANSLATORS }, function() {
 * oStore.getList('visitItems', function(lAllVisitItems) {
 * wDBSCAN.postMessage(lAllVisitItems); }); }); }); };
 * 
 * oDeleteRequest.onerror = function(event) { // TODO(rmoutard) : write error
 * function. }; } } else { // This is not the first visit. // DBSCAN2.
 * Cotton.DBSCAN2.startDbscanUser(); } } else { console.log("Browser doesn't
 * support the local storage"); }
 */

// Get all the indexedDB on this computer. Check if our ct database already
// exists.
var oDBRequest = window.webkitIndexedDB.getDatabaseNames();

oDBRequest.onsuccess = function(oIDBRequest) {

  if (_.indexOf(oIDBRequest.result, 'ct') === -1) {
    // The ct database doesn't exist. So it's the first installation.
    // Launch populateDB to create the database for the first time.
    Cotton.DB.populateDB(function() {
      var oStore = new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        oStore.getList('visitItems', function(lAllVisitItems) {
          wDBSCAN.postMessage(lAllVisitItems);
        });
      });
    });
  } else {
    // There is already a ct database. That means two choices :
    // - You open a tab after installation.
    // - It's not the first installation.
    // Depends on the value of CottonOpeningFirst.

    if (localStorage['ct-loading-page'] === undefined
        || localStorage['ct-loading-page'] === "true") {
      // It's not the first installation.
      // Cotton.DBSCAN2.startDbscanUser();

    } else {
      // You open a tab after installation.
      Cotton.DBSCAN2.startDbscanUser();
    }
  }

};

oDBRequest.onerror = function(event) {
  // TODO(rmoutard) : Create the database ?
};