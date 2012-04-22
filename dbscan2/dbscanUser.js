'use strict';

// this algo use dbscan on the last story and all the visited pages that have
// not been scanned yet.

function handleResultsOfDBSCAN2(iNbCluster, lVisitItems) {

  var dStories = Cotton.Algo.clusterStory(lVisitItems, iNbCluster);
  // var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);
  var bUseRelevance = Cotton.Config.Parameters.bUseRelevance;

  // TODO(rmoutard) : Choose what you really want to display.
  // UI
  $('#loader-animation').remove();
  Cotton.UI.Debug.displayStory(dStories.storyUnderConstruction);
  Cotton.UI.Debug.displayStories(dStories.stories);

  console.log("After cluster stories");
  console.log(dStories);

  // DB
  Cotton.DB.ManagementTools.addStories(dStories.stories);
}

// WORKER
// Use the worker of DBSCAN. It's exaclty the same. Just change the callback.
Cotton.DBSCAN2.dbscanWorker = new Worker('algo/worker.js');

Cotton.DBSCAN2.dbscanWorker.addEventListener('message', function(e) {
  // When DBSCAN is over, store new computed stories in the IndexedDB database.
  console.log("After dbscan");
  console.log(e.data.lVisitItems);
  console.log(e.data.iNbCluster);

  handleResultsOfDBSCAN2(e.data.iNbCluster, e.data.lVisitItems);
}, false);

Cotton.DBSCAN2.startDbscanUser = function() {
  //
  // dbscanUser should be called every time a new tab is open.
  // or maybe just new window for the beginning.

  var lastStory;
  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
    // Get the last Story in the database to know when we finished.
    this.getLastEntry('stories', function(oLastStory) {
      // TODO(rmoutard) : instead of range by id, use fLastVisitTime.
      var iLastId = oLastStory.getLastVisitItemId();
      console.log(iLastId);
      var oVisitStore = new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        this.getRange('visitItems', 0, iLastId, function(lPoolVisitItems) {
          console.log(lPoolVisitItems);
          Cotton.DBSCAN2.dbscanWorker.postMessage(lPoolVisitItems);
        });
      });
      /*
       * this.delete('stories', oStory, function(){ chrome.history.search({ //
       * Get all the historyItem we haven't scanned yet. text : '', startTime :
       * lastStory.lastVisitTime(), maxResults :
       * Cotton.Config.Parameters.iMaxResult, }, function(lHistoryItems) {
       * console.log("result with last Visit Item"); console.log(lHistoryItems); //
       * include current story's historyItems
       * 
       * lHistoryItems = lHistoryItems.concat(lastStory.iter());
       * console.log("Before dbscan"); console.log(lHistoryItems);
       * Cotton.DBSCAN2.dbscanWorker.postMessage(lHistoryItems); }); // end
       * search }); // end delete
       */
    }); // end getLastEntry
  });
};
