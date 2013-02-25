'use strict';

/**
 * I think The background page should never be displayed. So all the UI part
 * should be in lightyear page.
 * I still don't know if we should put a store only on the background page,
 * or if we can make one in lightyear. For the moment let's say it we can create
 * a store in lightyear.
 */
Cotton.Controllers.Background = Class.extend({

  /**
   * "Model" in MVC pattern. Global Store, that allow controller to make call to
   * the database. So it Contains 'visitItems' and 'stories'.
   */
  _oDatabase : null,

  /**
   * Worker to make the algo part in different thread.
   */
  _wDBSCAN3 : null,
  _wDBSCAN2 : null,


  /**
   * @constructor
   */
  init : function(){
   var self = this;

    self.initWorkerDBSCAN3();
    //self.initWorkerDBSCAN2();

    /**
     * Initialize the store.
     */

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {

          DEBUG && console.debug('Global store created');
          if (Cotton.ONEVENT === 'install') {
            self.install();
          } else if(Cotton.ONEVENT === 'update'){
            self.update();
          } else {
            // pass
          }
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
      chrome.tabs.query({'active':true, 'currentWindow': true}, function(lTabs){
        chrome.tabs.update(lTabs[0].id, {'url':'lightyear.html'}, function(){
        });
        // TODO(rkorach) : delete ct page from history
      });
    });
  },

  /**
   * Initialize the worker in charge of DBSCAN3, and link it to 'message'
   * listener.
   */
  initWorkerDBSCAN3 : function(){
    var self = this;
    self._wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

    self._wDBSCAN3.addEventListener('message', function(e) {

      // Is called when a message is sent by the worker.
      // Use local storage, to see that's it's not the first visit.
      DEBUG && console.debug('wDBSCAN3 - Worker ends with ',
        e.data['iNbCluster'], 'clusters.', ' For ',
        e.data['lVisitItems'].length, ' visitItems');

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oDatabase._translatorForDbRecord('visitItems',
          e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oDatabase.put('visitItems', oVisitItem, function() {
          // pass
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);

      // Add stories
      Cotton.DB.Stories.addStories(self._oDatabase, dStories['stories'],
          function(oDatabase, lStories){
            // pass because don't need to show stories in the world.
      });
    }, false);

  },

  /**
   * Install
   *
   * First installation, the database is empty. Need to populate. Then launch,
   * DBSCAN1 on the results.
   *
   */
  install : function(){
    var self = this;

    DEBUG && console.debug("Controller - install");

    Cotton.DB.Populate.visitItems(self._oDatabase, function(oDatabase) {
      oDatabase.getList('visitItems', function(lAllVisitItems) {
        DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
            + lAllVisitItems.length + ' items');
        DEBUG && console.debug(lAllVisitItems);
        var lAllVisitDict = [];
        for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = this._translatorForObject('visitItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lAllVisitDict.push(dItem);
        }
        DEBUG && console.debug(lAllVisitDict);
        self._wDBSCAN3.postMessage(lAllVisitDict);
      });
    });

  },


  /**
   * Update
   *
   * If something is needed. But nothing for the moment.
   */
  update : function(){
    DEBUG && console.debug("update");
  },
});

chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
  Cotton.ONEVENT = oInstallationDetails['reason'];
});

Cotton.BACKGROUND = new Cotton.Controllers.Background();

