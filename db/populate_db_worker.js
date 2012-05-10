'use strict';

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../init.js');

importScripts('../lib/underscore.js');
importScripts('../lib/parseURL.js');

importScripts('../algo/tools.js');

importScripts('init.js');
importScripts('translator.js');
importScripts('engine.js');
importScripts('store.js');

importScripts('../model/init.js')
importScripts('../model/visit_item.js');

importScripts('../translators/init.js');
importScripts('../translators/visit_item_translator.js');

importScripts('populate_db.js');

populateDBWorker = function(lVisitItems){

    lVisitItems = Cotton.DB.preRemoveTools(lVisitItems);

    var iCount = 0;
    var iPopulationLength = lVisitItems.length;

    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      console.log("store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lVisitItems[i]; i++) {
        var oVisitItem = new Cotton.Model.VisitItem();

        oVisitItem._sUrl = oHistoryItem.url;
        oVisitItem._sTitle = oHistoryItem.title || '';
        oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

        oStore.put('visitItems', oVisitItem, function(iId) {
          // TODO(rmoutard) : check that iId is really the id created by
          // auto-incremenation.
          iCount += 1;

          if (iCount === iPopulationLength) {
            //mCallBackFunction.call();
            var dData = {};
            self.postMessage(dData); // Send serialized data to the main thread.
            self.close(); // Terminates the worker.
          }
        });
      }
    });

}
self.addEventListener('message', function(e) {
  // Connect worker with main thread.

  // Worker starts when it receive postMessage().
  // Data received are serialized.
  // i.e. it's non Cotton.Model.VisitItem, but serialized object.
  populateDBWorker(e.data);
}, false);
