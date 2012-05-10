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

var wPopulateDB = new Worker('db/populate_db_worker.js');

wPopulateDB.addEventListener('message', function(e){
  // Called when the worker is finished.
  // When populateDB has finished, take all the elements in the store, and
  // launch DBSCAN.
  var oStore = new Cotton.DB.Store('ct', {
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            oStore.getList('visitItems', function(lAllVisitItems) {
              wDBSCAN.postMessage(lAllVisitItems);
            });
          });

}, false);
// START
if (localStorage) {
  // Check if broswer support localStorage

  if (localStorage['CottonFirstOpening'] === undefined
      || localStorage['CottonFirstOpening'] === "true") {
    // This is the first visit.
    chrome.history.search({
      text : '',
      startTime : 0,
      maxResults : Cotton.Config.Parameters.iMaxResult,
      }, function(lHistoryItems) {
        wPopulateDB.postMessage(lHistoryItems);
      });
    /*
    Cotton.DB.ManagementTools.purge('visitItems', function() {
      Cotton.DB.ManagementTools.purge('stories', function() {
        Cotton.DB.populateDB(function() {
          var oStore = new Cotton.DB.Store('ct', {
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            oStore.getList('visitItems', function(lAllVisitItems) {
              wDBSCAN.postMessage(lAllVisitItems);
            });
          });
        });
      });
    });
  */
  } else {
    // This is not the first visit.

    // DBSCAN2.
    Cotton.DBSCAN2.startDbscanUser();
  }

} else {
  console.log("Browser doesn't support the local storage");
}
