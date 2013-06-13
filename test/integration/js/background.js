'use strict';
chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {

});

var oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ctb', {
    'searchKeywords': Cotton.Model.SearchKeyword,
    'historyItems': Cotton.Model.HistoryItem,
    'stories': Cotton.Model.Story
  }, function() {
    console.log('Database ready - start installation.');
    // Get the historyClient (depends on the browser)
    var oClient = new Cotton.Core.History.Client();

    DEBUG && console.debug('PopulateHistoryItems - Start');
    var oBenchmark = new Benchmark("PopulateDB");
    var glCottonHistoryItems = [];
    if(oClient){
      // Get chrome historyItems.
      oClient.get({
        text : '', // get all
        startTime : 0, // no start time.
        "maxResults" : Cotton.Config.Parameters.dbscan3.iMaxResult,
      }, function(lChromeHistoryItems) {
        oBenchmark.step('Get all historyItems');
        console.log('nb of history Items: ' + lChromeHistoryItems.length);
        glCottonHistoryItems = Cotton.Core.Populate.translateListOfChromeHistoryItems(lChromeHistoryItems);

         oDatabase.putList('historyItems', glCottonHistoryItems, function(lIds) {

          oBenchmark.step('Put all historyItems in the database');
          oBenchmark.end();
        });

      });

    }
});

