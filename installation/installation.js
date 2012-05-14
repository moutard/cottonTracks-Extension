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

Cotton.Installation.firstInstallation = function() {
  Cotton.DB.populateDB(function() {
    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      oStore.getList('visitItems', function(lAllVisitItems) {
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
    Cotton.Installation.firstInstallation();
  } else {
    // There is already a ct database. That means two choices :
    // - You open a tab after installation.
    // - It's not the first installation.
    // Depends on the value of CottonOpeningFirst.

    if (localStorage['CottonFirstOpening'] === undefined) {
      // It's not the first installation.
      //localStorage['CottonFirstOpening'] = false;
      Cotton.Installation.notFirstInstallation();

    } else {
      // You open a tab after installation.
      Cotton.DBSCAN2.startDbscanUser();
    }
  }

};

oDBRequest.onerror = function(oEvent) {
  // TODO(rmoutard) : Create the database ?
};
