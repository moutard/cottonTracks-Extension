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

  /**
   * "Model" in MVC pattern. Global Store, that allow controller to make call to
   * the database. So it Contains 'visitItems' and 'stories'.
   */
  _oStore : null,

  /**
   * "View" in MVC pattern. Global view, contains the stickybar, the homepage.
   */
  _oWorld : null,

  /*
   * "Installer" TODO(rmoutard) : use event chrome.runtime.onInstalled Maybe
   * create an installer. (By the way with events page there is onInstallation)
   */

  _wDBSCAN1 : null,
  _wDBSCAN2 : null,
  _wDBSCAN3 : null,

  _iTmpId : 0,

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

    self._iTmpId = 0;
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
          // console.log("update queryKeywords");
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
    self._wDBSCAN2 = new Worker('algo/dbscan3/worker_dbscan3.js');

    self._wDBSCAN2.addEventListener('message', function(e) {
      console.log("After dbscan2");
      console.log(e.data['lVisitItems']);
      console.log(e.data['iNbCluster']);

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
          e.data['iNbCluster']);

      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'], function(oStore, lStories){
        // Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
        // Cotton.UI.oWorld.update();
        console.log(lStories);
        // Cotton.UI.oWorld.pushStories(lStories);
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

      // Is called when a message is sent by the worker.
      Cotton.UI.openCurtain();
      if(Cotton.UI.oCurtain){ Cotton.UI.oCurtain.increasePercentage(5);}
      // Use local storage, to see that's it's not the first visit.
      localStorage['CottonFirstOpening'] = "false";
      console.log('wDBSCAN3 - Worker ends with ', e.data['iNbCluster'], 'clusters.', ' For ', e.data['lVisitItems'].length, ' visitItems');

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oStore._translatorForDbRecord('visitItems',
                                                      e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oStore.put('visitItems', oVisitItem, function() {
          // console.log("update queryKeywords");
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);

      // Add stories
      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'],
          function(oStore, lStories){
            console.log("proroor");
            console.log(lStories);
            Cotton.UI.oWorld.pushStories(lStories);
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
    if(Cotton.UI.oCurtain){Cotton.UI.oCurtain.increasePercentage(20)};
    Cotton.DB.Populate.visitItems(self._oStore, function(oStore) {
      if(Cotton.UI.oCurtain){Cotton.UI.oCurtain.increasePercentage(20);}
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
        if(Cotton.UI.oCurtain){Cotton.UI.oCurtain.increasePercentage(10);}
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
      var iLastStoryId =  oLastStory.id();
      //self._oStore.delete('stories', oLastStory.id(), function(iId){
      //  console.log("story deleted");
      //});

      var lPoolVisitItems = [];

      // Get visitItems of the last story.
      self._oStore.findGroup('visitItems', 'id', lVisitItemsId,
        function(lLastStoryVisitItems) {

          lPoolVisitItems = lPoolVisitItems.concat(lLastStoryVisitItems);
          // Remember that those elements were in a story.
          _.each(lPoolVisitItems, function(oVisitItem){
            oVisitItem.setStoryId(iLastStoryId);
          });
          // Get visitItems not computed.
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

  /**
   * Controller - Notication Center Each time the UI, is modify, the UI call the
   * controller.
   */

  /**
   * Remove the visit in a given Story. Send by {Cotton.UI.Story.ItemEditbox}.
   *
   * @param {int}
   *          iStoryId : id is found using mystoryline.
   * @param {int}
   *          iVisitItemId : id is send by the item_editbox.
   */
  removeVisitItemInStory : function(iVisitItemId){
    var self = this;
    var iStoryId = _oCurrentlyOpenStoryline.story().id();
    _oCurrentlyOpenStoryline.story().removeVisitItem(iVisitItemId);
    Cotton.DB.Stories.removeVisitItemInStory(self._oStore,
        iStoryId, iVisitItemId,
        function(){
          console.log('ok - removeVisitItem');
    });
  },

  /**
   * Set the visit in a given Story. Send by {Cotton.UI.Story.ItemEditbox}.
   *
   * @param {Cotton.Model.VisitItem}
   *          oVisitItem : after set the visitItem put.
   */
  setVisitItem : function(oVisitItem){
    var self = this;
    self._oStore.put('visitItems', oVisitItem, function(id){
      console.log("setVisit id : " + id);
    })
  },

  /**
   * Merge two stories. Becareful parameters are not symetric. All the elments
   * of sub_story will be put in the main_story, and then the sub story will be
   * removed.
   *
   * @param {int}
   *          iMainStoryId : id of the story that receive new elements
   * @param {int}
   *          iSubStoryId : id of the story that is removed
   */
  mergeStoryInOtherStory : function(iMainStoryId, iSubStoryId, mCallBackFunction){
    var self = this;

    // get the two stories.
    self._oStore.find('stories', 'id', iMainStoryId, function(oMainStory){
      self._oStore.find('stories', 'id', iSubStoryId, function(oSubStory){
        var lVisitItemsIdToAdd = oSubStory.visitItemsId();
        // Add each visitItem in the oMainStory.
        for(var i=0; i < oSubStory.visitItemsId().length; i++){
          var iId = oSubStory.visitItemsId()[i];
          oMainStory.addVisitItemId(iId);
        }

        // Update the main story.
        self._oStore.put('stories', oMainStory, function(iId){

          // Remove the sub story.
          self._oStore.delete('stories', iSubStoryId, function(){
            console.log("controller - stories merged");
            mCallBackFunction(lVisitItemsIdToAdd);
          });
        });

      });
    });
  },

  /**
   * Set story
   *
   * @param {Cotton.Model.Story}
   *          oStory
   */

  setStory : function(oStory){
    var self = this;
    self._oStore.put('stories', oStory, function(iId){
      console.log('controller - story updated');
    });
  },

  /**
   * Delete the story with the given story id.
   *
   * @param {int} :
   *          iStoryId
   */
  deleteStory : function(iStoryId){
    var self = this;

    self._oStore.delete('stories', 'id', iStoryId, function(){
      console.log("controller - delete story");
    });
  },

  /**
   * Delete the story and visitItems with the given story id.
   *
   * @param {int} :
   *          iStoryId
   */
  deleteStoryAndVisitItems : function(iStoryId){
    var self = this;

    self._oStore.find('stories', 'id', iStoryId, function(oStory){
      for(var i = 0; i < oStory.visitItemsId().length; i++){
        var iId = oStory.visitItemsId()[i];
        this.delete('visitItems', iId, function(){
          console.log("delete visitItem");
        });
      }
      this.delete('stories', oStory.id(), function() {
        console.log("delete story");
      });
    });
  },

  searchStoryFromTags : function(lTags, mCallbackFunction){
    var self = this;
    self._oStore.search('stories', 'lTags', lTags[0] , function(lStories){
      var _lStories = lStories;
      var lStoriesId = [];
      _.each(_lStories, function(oStory){
        lStoriesId.push(oStory.id());
      });
      self._oWorld.stickyBar().removeStickersFromStoriesId(lStoriesId);
      mCallbackFunction(lStories);
    });
  },

});

Cotton.CONTROLLER = new Cotton.Controller();
