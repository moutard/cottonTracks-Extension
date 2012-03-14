'use strict';

// this algo use dbscan on the last story and all the visited pages that have
// not been scanned yet.

// WORKER
// Use the worker of DBSCAN. It's exaclty the same. Just change the callback.
Cotton.DBSCAN2.dbscanWorker = new Worker('algo/worker.js');

dbscanWorker.addEventListener('message', function(e) {
  console.log('Worker ends: ', e.data.iNbCluster);
  // When DBSCAN is over, store new computed stories in the IndexedDB database.
  var lStories = Cotton.Algo.clusterStory(e.data.lHistoryItems, e.data.iNbCluster);
  Cotton.DB.ManagementTools.addStories(lStories);
}, false);

$(Cotton.DBSCAN2.dbscanUser = function () {
  // 
  // dbscanUser should be called every time a new tab is open.
  // or maybe just new window for the beginning.

  var lastStory;
  var oStore = new Cotton.DB.Store('ct',
        { 'stories': Cotton.Translators.STORY_TRANSLATORS },
        function() {
          // Get the last Story in the database to know when we finished.
          this.getLastEntry('stories', function(oStory){
            lastStory = oStory;
            
            chrome.history.search({
              // Get all the historyItem we haven't scanned yet.
              text : '',
              startTime : lastStory.lastVisitTime(),
              maxResults : Cotton.Config.Parameters.iMaxResult,
            }, function(lHistoryItems) {

              // include current story's historyItems
              lHistoryItems = lHistoryItems.concat(lastStory.iter());
              worker.postMessage(lHistoryItems);
            });
          });
        } 
  );
};)();
