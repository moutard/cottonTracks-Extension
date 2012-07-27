'use strict';
/**
 * Get Visit Item Worker
 *
 * Workers are in charge of parallelize task.
 */

// Worker has no access to external librairies loaded in the main thread.
// Cotton.lib.
importScripts('../../lib/class.js');
importScripts('../../lib/underscore.js');

importScripts('../../init.js');

// Cotton.config
importScripts('../../config/init.js');
importScripts('../../config/config.js');

// Cotton.db.
importScripts('../../db/init.js');
importScripts('../../db/engine.js');
importScripts('../../db/translator.js');
importScripts('../../db/store.js');

// Cotton.model
importScripts('../../model/init.js');
importScripts('../../model/extracted_dna.js');
importScripts('../../model/visit_item.js');

importScripts('../../translators/init.js');
importScripts('../../translators/visit_item_translators.js');

self.addEventListener('message', function(e) {
  /**
   * Connect worker with main thread.
   * Worker starts when it receive postMessage().
   * Data received are serialized.
   * i.e. it's non Cotton.Model.VisitItem, but object.
   */
  // e.data is a array of id you want to get.
  getVisitItems(e.data);
}, false);

/**
 * Get visitItems you want.
 *
 * @param {Array.<int>} lVisitItemId : list of visitItems id you want to grab.
 */
function getVisitItems(lVisitItemId){
  var oStore = new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
      oStore.findGroup('visitItems', 'id', lVisitItemId,
        function(lVisitItems) {
          /** Send data to the main thread. Data are serialized */
          self.postMessage(lVisitItems);

          /** Terminates the worker */
          self.close();
        });
  });
}

