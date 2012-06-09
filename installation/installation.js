'use strict';
Cotton.Stores = {};

var startTime = new Date().getTime();
var elapsedTime = 0;

var handleResultsOfFirstDBSCAN = function(iNbCluster, lVisitItems) {

  // Update the visitItems with extractedWords and queryWords.
  new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
    for ( var i = 0; i < lVisitItems.length; i++) {
      var oVisitItem = new Cotton.Model.VisitItem();
      oVisitItem.deserialize(lVisitItems[i]);
      this.put('visitItems', oVisitItem, function() {
        console.log("update queryKeywords");
        if (i === (lVisitItems.length - 1)) {
          elapsedTime = (new Date().getTime() - startTime) / 1000;
          console.log('@@Time to update query : ' + elapsedTime + 's');
        }
      });
    }
  });

  var dStories = Cotton.Algo.clusterStory(lVisitItems, iNbCluster);

  // var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);
  // var bUseRelevance = Cotton.Config.Parameters.bUseRelevance;

  // UI
  // $('#loader-animation').remove();
  // Cotton.UI.Debug.displayStory(dStories.storyUnderConstruction);
  // Cotton.UI.Debug.displayStories(dStories.stories);

  // DB
  // Cotton.DB.ManagementTools.addHistoryItems(lHistoryItems);
  var lStories = dStories.stories.reverse();

  console.log("Add Stories by chronology");

  new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
    this.putList('stories', lStories, function(lAllId) {
      console.log("Stories added");
      console.log(lAllId);
      Cotton.UI.oWorld.update();
    });
  });
  // Cotton.DB.ManagementTools.addStoriesByChronology(dStories.stories);

  // Cotton.UI.oWorld.update();
}

// WORKER
// DBSCAN is lauched in a worker used as multithread.
var wDBSCAN = new Worker('algo/worker.js');

wDBSCAN.addEventListener('message', function(e) {
  // Is called when a message is sent by the worker.
  Cotton.UI.openCurtain();
  // Use local storage, to see that's it's not the first visit.
  localStorage['CottonFirstOpening'] = "false";
  console.log('wDBSCAN - Worker ends: ', e.data.iNbCluster);
  elapsedTime = (new Date().getTime() - startTime) / 1000;
  console.log('@@Time to worker : ' + elapsedTime + 's');
  handleResultsOfFirstDBSCAN(e.data.iNbCluster, e.data.lVisitItems);

}, false);

Cotton.Installation.firstInstallation = function() {

  console.debug('FirstInstallation - Start');

  Cotton.DB.populateDB(function() {
    new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      this.getList('visitItems', function(lAllVisitItems) {
        elapsedTime = (new Date().getTime() - startTime) / 1000;
        console.log("@@Time to populateDB : " + elapsedTime + 's');
        console.debug('FirstInstallation - Start wDBSCAN with '
            + lAllVisitItems.length + ' items');
        wDBSCAN.postMessage(lAllVisitItems);
      });
    });
  });
};

Cotton.Installation.notFirstInstallation = function() {
  var bClear = confirm("An old database has been found. Do you want to clear it ?");

  if (bClear) {
    /*
     * You want to remove the old database.
     */
    var oDeleteRequest = webkitIndexedDB.deleteDatabase('ct');
    oDeleteRequest.onsuccess = function(oIDBRequest) {
      Cotton.Installation.firstInstallation();
    };
    oDeleteRequest.onerror = function(oIDBRequest) {
      // TODO(rmoutard) : write error method.
    };
  } else {
    // TODO(rmoutard) : Handle this result.
    Cotton.DBSCAN2.startDbscanUser();
  }
};

// START.
// Get all the indexedDB on this computer. Check if our ct database already
// exists.
var oDBRequest = webkitIndexedDB.getDatabaseNames();

oDBRequest.onsuccess = function(oEvent) {
  console.log(this.result);
  console.log(localStorage['CottonFirstOpening']);
  if (_.indexOf(this.result, 'ct') === -1) {
    // The ct database doesn't exist. So it's the first installation.
    // Launch populateDB to create the database for the first time.
    console.log('Installation : No database - First Installation');

    Cotton.Installation.firstInstallation();

  } else {
    // There is already a ct database. That means two choices :
    // - You open a tab after installation.
    // - It's not the first installation.
    // Depends on the value of CottonOpeningFirst.

    if (localStorage['CottonFirstOpening'] === undefined) {
      // It's not the first installation.
      // localStorage['CottonFirstOpening'] = false;
      console
          .log('Installation : Already a data base - Not first Installation');
      Cotton.Installation.notFirstInstallation();

    } else {
      // You open a tab after installation.
      console.log('Installation : already installed - DBSCAN2');
      Cotton.DBSCAN2.startDbscanUser();
    }
  }

};

oDBRequest.onerror = function(oEvent) {
  // TODO(rmoutard) : Create the database ?
};
