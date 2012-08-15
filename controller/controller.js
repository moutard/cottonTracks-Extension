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
  _oWorld : null,
  _wDBSCAN1 : null,
  _wDBSCAN2 : null,
  _wDBSCAN3 : null,

  /**
   * @constructor
   */
  init : function(){

    var self = this;
    console.debug("Controller - init -");

    $(window).load(function(){
        Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
    });
    self.initWorkerDBSCAN1();
    self.initWorkerDBSCAN2();
    self.initWorkerDBSCAN3();
    /**
     * Check if a ct database already exists.
     */

    self._oStore = new Cotton.DB.Store('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            console.debug('Global store created');
            self._oStore.empty('visitItems', function(bIsEmpty){
              console.debug('Ask if empty');
              if(bIsEmpty){
                console.log('Installation : The database is empty - first Installation');
                self.install();
              } else if (localStorage['CottonFirstOpening'] === undefined) {
                // It's not the first installation.
                // localStorage['CottonFirstOpening'] = false;
                console.log('Installation : Already a data base - Not first Installation');
                self.reinstall();

              } else {
                // You open a tab after installation.
                console.debug('Contoller : already installed - DBSCAN2');
                self.start();
              }
            })
    });
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
            // Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
            Cotton.UI.oWorld.update();
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
        // Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
        // Cotton.UI.oWorld.update();
      });

    }, false);

  },
  
  /**
   * Initialize the worker in charge of DBSCAN3, and link it to 'message'
   * listener.
   */
  initWorkerDBSCAN3 : function(){
    var self = this;
    self._wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

    self._wDBSCAN3.addEventListener('message', function(e) {
      Cotton.Utils.debug("DBSCAN 3 - MESSAGE");
      Cotton.Utils.debug(e);
      
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
            // Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
            Cotton.UI.oWorld.update();
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
        self._wDBSCAN3.postMessage(lAllVisitDict);
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
       * Purge all datas in the old database.
       */
      self._oStore.purge('visitItems', function(){
        self._oStore.purge('stories', function(){
          self.install();
        });
      });
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
