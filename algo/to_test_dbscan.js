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
var worker = new Worker('algo/worker.js');

worker.addEventListener('message', function(e) {
  // Is called when a message is sent by the worker.

  console.log('Worker ends: ', e.data.iNbCluster);
  handleResultsOfFirstDBSCAN(e.data.iNbCluster, e.data.lVisitItems);

}, false);

// START
if (localStorage) {
  // Check if broswer support localStorage

  if (localStorage['CottonFirstOpening'] === undefined
      || localStorage['CottonFirstOpening'] === "true") {
    // This is the first visit.

    // - Load the first visit page.
    Cotton.UI.firstVisit();

    // - Get All the historyItems
    /*
     * chrome.history.search({ text : '', startTime : 0, maxResults :
     * Cotton.Config.Parameters.iMaxResult, }, function(lHistoryItems) { //
     * DBSCAN. worker.postMessage(lHistoryItems); });
     */
    Cotton.DB.populateDB(function() {
      var oStore = new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        oStore.getList('visitItems', function(lAllVisitItems) {
          console.log(lAllVisitItems);
          worker.postMessage(lAllVisitItems);
        });
      });
    });
    // Use local storage, to see that's it's not the first visit.
    localStorage['CottonFirstOpening'] = "false";

  } else {
    // This is not the first visit.

    // DBSCAN2.
    Cotton.DBSCAN2.startDbscanUser();
  }

} else {
  console.log("Browser doesn't support the local storage");
}
