'use strict'
/**
 * Controller
 * 
 * Inspired by MVC pattern.
 * 
 * Handles DB, and UI.
 * 
 */
Cotton.Controller = Class.extend({

  _oStore : null,
  _oworld : null,
  _wDBSCAN1 : null,
  _wDBSCAN2 : null,

  /**
   * @constructor
   */
  init : function(){

    var self = this;
    console.debug("Controller - init -");

    self.initWorkerDBSCAN1();
    self.initWorkerDBSCAN2();
    /**
     * Check if a ct database already exists.
     */

    var oDBRequest = webkitIndexedDB.getDatabaseNames();

    oDBRequest.onsuccess = function(oEvent) {
      console.info("getDatabaseNames succeed and return oEvent : ");
      console.info(oEvent);
      console.info(this);

      if (_.indexOf(this.result, 'ct') === -1) {
        /**
         * The ct database doesn't exist. So it's the first installation.
         * 
         * Launch populateDB to create the database for the first time.
         */
         console.debug('Installation : No database - First Installation');

        /**
         * Initialize store
         */
        self._oStore = new Cotton.DB.Store('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            console.debug('Global store created');
            self.install();
        });

      } else {
        /**
         * Initialize store
         */
        self._oStore = new Cotton.DB.Store('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            console.debug('Global store created');

          /**
           * There is already a ct database. That means two choices : - You open
           * a tab after installation. - It's not the first installation.
           * Depends on the value of CottonOpeningFirst.
           */
          if (localStorage['CottonFirstOpening'] === undefined) {
            // It's not the first installation.
            // localStorage['CottonFirstOpening'] = false;
            console
                .log('Installation : Already a data base - Not first Installation');
            self.reinstall();

          } else {
            // You open a tab after installation.
            console.debug('Contoller : already installed - DBSCAN2');
            self.start();
          }

        });


      }
    };

    oDBRequest.onerror = function(oEvent) {
      console.error('getDatabaseNames - an error occured');
      console.info(oEvent);
    };
  },

  /**
   * Initialize the worker in charge of DBSCAN1, and link it to 'message'
   * listener.
   */
  initWorkerDBSCAN1 : function(){
    var self = this;
    self._wDBSCAN1 = new Worker('algo/dbscan1/worker.js');

    self._wDBSCAN1.addEventListener('message', function(e) {
      // Is called when a message is sent by the worker.
      Cotton.UI.openCurtain();
      // Use local storage, to see that's it's not the first visit.
      localStorage['CottonFirstOpening'] = "false";
      console.log('wDBSCAN - Worker ends: ', e.data['iNbCluster']);

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // var oVisitItem = new Cotton.Model.VisitItem();
        // oVisitItem.deserialize(e.data.lVisitItems[i]);
        var oTranslator = self._oStore._translatorForDbRecord('visitItems',
                                                      e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oStore.put('visitItems', oVisitItem, function() {
          console.log("update queryKeywords");
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);
      // Add stories
      // var lStories = dStories['stories'].reverse();
      console.log(dStories);
      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'],
          function(oStore){
            Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
      });
    }, false);

  },

  /**
   * Initialize the worker in charge of DBSCAN2, and link it to 'message'
   * listener.
   */
  initWorkerDBSCAN2 : function(){
    // TODO(rmoutard) : create DBSCAN2
    var self = this;
    self._wDBSCAN2 = new Worker('algo/dbscan1/worker.js');

    self._wDBSCAN2.addEventListener('message', function(e) {
      console.log("After dbscan2");
      console.log(e.data['lVisitItems']);
      console.log(e.data['iNbCluster']);

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
          e.data['iNbCluster']);

      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'], function(oStore){
        Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
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
    console.debug("Controller - install");

    var self = this;

    Cotton.DB.Populate.visitItems(self._oStore, function(oStore) {
      oStore.getList('visitItems', function(lAllVisitItems) {
        console.debug('FirstInstallation - Start wDBSCAN with '
            + lAllVisitItems.length + ' items');
        console.debug(lAllVisitItems);
        var lAllVisitDict = [];
        for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = this._translatorForObject('visitItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lAllVisitDict.push(dItem);
        }
        console.debug(lAllVisitDict);
        self._wDBSCAN1.postMessage(lAllVisitDict);
        });
    });

  },

  /**
   * Reinstall
   * 
   * An old database has been found. Allow you to keep your old data, our clear
   * the database and restart from the begining.
   */
  reinstall : function(){
    console.debug("Controller - reinstall");

    var self = this;

    var bClear = confirm("An old database has been found. Do you want to clear it ?");
    if (bClear) {
      /*
       * You want to remove the old database.
       */
      var oDeleteRequest = webkitIndexedDB.deleteDatabase('ct');

      oDeleteRequest.onsuccess = function(oIDBRequest) {
        self.install();
      };

      oDeleteRequest.onerror = function(oIDBRequest) {
        console.error("ct - Controller - An error occured when you tried to remove the database");
        console.error(oIDBRequest);
      };

    } else {
      // TODO(rmoutard) : Handle this result.
      self.start();
    }


  },

  /**
   * Start
   * 
   * ct is well installed, start the application.
   */
  start : function(){
    console.debug("Controller - start");
    var self = this;
    // Cotton.DBSCAN2.startDbscanUser();

    self._oStore.getLast('stories', 'fLastVisitTime', function(oLastStory){
      /**
       * Delete the last story and recompute it.
       */
      var lVisitItemsId = oLastStory.visitItemsId();
      self._oStore.delete('stories', oLastStory.id(), function(iId){
        console.log("story deleted");
      });

      var lPoolVisitItems = new Array();

      self._oStore.findGroup('visitItems', 'id', lVisitItemsId,
        function(lLastStoryVisitItems) {
          lPoolVisitItems = lPoolVisitItems.concat(lLastStoryVisitItems);

          self._oStore.getLowerBound('visitItems', 'iVisitTime',
            oLastStory.lastVisitTime(), "PREV", false,
              function(lUnclassifiedVisitItem) {
                lPoolVisitItems = lPoolVisitItems
                    .concat(lUnclassifiedVisitItem);
                console.log(lPoolVisitItems);
                var lPoolVisitDict = [];
                for(var i = 0, oItem; oItem = lPoolVisitItems[i]; i++){
                  // maybe a setFormatVersion problem
                  var oTranslator = this._translatorForObject('visitItems', oItem);
                  var dItem = oTranslator.objectToDbRecord(oItem);
                  lPoolVisitDict.push(dItem);
                }

                self._wDBSCAN2.postMessage(lPoolVisitDict);
              });
        });
    });
  },

});

Cotton.oController = new Cotton.Controller();
