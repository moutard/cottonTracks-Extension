'use strict';
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

  /**
   * Error Handler
   */
  _oErrorHandler : null,

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
    LOG && console.log("Controller - init -");

    Cotton.UI.oErrorHandler = self._oErrorHandler = new Cotton.UI.ErrorHandler(window);

    $(window).load(function(){
        Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
    });
    //self.initWorkerDBSCAN1();
    //self.initWorkerDBSCAN2();
    //self.initWorkerDBSCAN3();

    self._iTmpId = 0;
    /**
     * Check if a ct database already exists.
     */

    self._oStore = new Cotton.DB.Store('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
          'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
          }, function() {
            DEBUG && console.debug('Global store created');
            self._oStore.empty('visitItems', function(bIsEmpty){
              DEBUG && console.debug('Ask if empty');
              if(bIsEmpty){
                LOG && console.log('Installation : The database is empty - first Installation');
                self.install();
              } else if (localStorage['CottonFirstOpening'] === undefined) {
                // It's not the first installation.
                // localStorage['CottonFirstOpening'] = false;
                LOG && console.log('Installation : Already a data base - Not first Installation');
                self.reinstall();

              } else {
                // You open a tab after installation.
                DEBUG && console.debug('Contoller : already installed - DBSCAN2');
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
      self._oWorld.curtain().open();
      // Use local storage, to see that's it's not the first visit.
      localStorage['CottonFirstOpening'] = "false";
      DEBUG && console.log('wDBSCAN - Worker ends: ', e.data['iNbCluster']);

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // var oVisitItem = new Cotton.Model.VisitItem();
        // oVisitItem.deserialize(e.data.lVisitItems[i]);
        var oTranslator = self._oStore._translatorForDbRecord('visitItems',
                                                      e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oStore.put('visitItems', oVisitItem, function() {
          // pass
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);
      // Add stories
      DEBUG && console.debug(dStories);
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
      DEBUG && console.debug("After dbscan2");
      DEBUG && console.debug(e.data['lVisitItems']);
      DEBUG && console.debug(e.data['iNbCluster']);

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
          e.data['iNbCluster']);

      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'], function(oStore, lStories){
        // Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
        // Cotton.UI.oWorld.update();
        DEBUG && console.debug(lStories);
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
      self._oWorld.curtain().open();
      if(Cotton.UI.oCurtain){ Cotton.UI.oCurtain.increasePercentage(5);}
      // Use local storage, to see that's it's not the first visit.
      localStorage['CottonFirstOpening'] = "false";
      DEBUG && console.debug('wDBSCAN3 - Worker ends with ', e.data['iNbCluster'], 'clusters.', ' For ', e.data['lVisitItems'].length, ' visitItems');

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oStore._translatorForDbRecord('visitItems',
                                                      e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oStore.put('visitItems', oVisitItem, function() {
          // pass
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);

      // Add stories
      Cotton.DB.Stories.addStories(self._oStore, dStories['stories'],
          function(oStore, lStories){
            Cotton.UI.oWorld.stickyBar().pushStories(lStories);
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
        LOG && console.log('FirstInstallation - Start wDBSCAN with '
            + lAllVisitItems.length + ' items');
        DEBUG && console.debug(lAllVisitItems);
        var lAllVisitDict = [];
        for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = this._translatorForObject('visitItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lAllVisitDict.push(dItem);
        }
        if(Cotton.UI.oCurtain){Cotton.UI.oCurtain.increasePercentage(10);}
        DEBUG && console.debug(lAllVisitDict);
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
    LOG && console.log("Controller - reinstall");

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
    LOG && console.log("Controller - start");
    var self = this;
    // Cotton.DBSCAN2.startDbscanUser();

    /*
    self._oStore.getLast('stories', 'fLastVisitTime', function(oLastStory){
           var lVisitItemsId = oLastStory.visitItemsId();
      var iLastStoryId =  oLastStory.id();

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
                DEBUG && console.debug(lPoolVisitItems);
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
    */
  },

  /**
   * --------------------------------------------------------------------------
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
          DEBUG && console.debug('ok - removeVisitItem');
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
      DEBUG && console.debug("setVisit id : " + id);
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
            DEBUG && console.debug("controller - stories merged");
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
      DEBUG && console.debug('controller - story updated');
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
      DEBUG && console.debug("controller - delete story");
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
          DEBUG && console.debug("delete visitItem");
        });
      }
      this.delete('stories', oStory.id(), function() {
        DEBUG && console.debug("delete story");
      });
    });
  },

  /**
   * Received from the UI the search parameters. Make the search. And return the
   * stories that corresponds to the search pattern.
   *
   * @param {string}
   *          sSearchPattern
   * @param mCallbackFunction
   */
  searchStoryFromTags : function(sSearchPattern, mCallbackFunction){
    var self = this;
    // TODO(rmoutard) : simply use the first tag. Do better.
    if(sSearchPattern!==""){
      var lTags = sSearchPattern.toLowerCase().split(" ");
      if(lTags.length > 0){
        self._oStore.search('stories', 'lTags', lTags[0] , function(lStories){
          self._oWorld.stickyBar().showResultFromSearch(lStories);
          mCallbackFunction(lStories);
        });
      }
    }
  },

  /**
   * Received from the UI the search parameters. Search the corresponding
   * keyword on the database 'searchKeywords'. And return the stories that
   * corresponds to those keywords.
   *
   * @param {string}
   *          sSearchPattern
   * @param mCallbackFunction
   */
  searchStoryFromSearchKeywords : function(sSearchPattern, mCallbackFunction){
    var self = this;
    // TODO(rmoutard) : simply use the first tag. Do better.
    if(sSearchPattern!==""){
      var lTags = sSearchPattern.toLowerCase().split(" ");
      if(lTags.length > 0){
        self._oStore.find('searchKeywords', 'sKeyword', lTags[0],
            function(oSearchKeyword){
              if(oSearchKeyword){
              DEBUG && console.debug(oSearchKeyword);
              var lReferringStoriesId =  oSearchKeyword.referringStoriesId();

              self._oStore.findGroup('stories', 'id', lReferringStoriesId,
                function(lStories){
                  DEBUG && console.debug(lStories);
                  self._oWorld.stickyBar().showResultFromSearch(lStories);
                  mCallbackFunction(lStories.length);
                });
              } else {
                // TODO(rmoutard) : return a non find message.
                self._oWorld.searchpage().nothingFoundError();
                mCallbackFunction();
              }
            });
      }
    }
  },

  /**
   * Remove the search result stickers, and put the world as it was before.
   */
  resetSearch : function(iNbStoriesToChange){
    var self = this;
    // TODO(rmoutard) : use the store of the controller.
    Cotton.DB.Stories.getXStories(iNbStoriesToChange, function(lStories) {
      self._oWorld.stickyBar().resetSearch(lStories);
    });
  },

  /**
   * --------------------------------------------------------------------------
   * Controller - Favorites Website
   */

  removeFavoritesWebsite : function(iId) {
    var lFavorites = JSON.parse(localStorage['ct-favorites_webistes']);
    lFavorites = _.reject(lFavorites, function(dRecord){
          return dRecord['id'] === iId;
    });
    localStorage['ct-favorites_webistes'] = JSON.stringify(lFavorites);
  },

  addFavoritesWebsite : function(dRecord, mCallbackFunction) {
    var lFavorites = JSON.parse(localStorage['ct-favorites_webistes']);
    var iNextId = _.max(lFavorites, function(dRecord){
      return dRecord['id'];
    }) + 1;
    dRecord['id'] = iNextId;
    lFavorites.push(dRecord);
    localStorage['ct-favorites_webistes'] = JSON.stringify(lFavorites);
    mCallbackFunction(iNextId);
  },

  setFavoritesWebsite : function(dRecord, mCallbackFunction) {
    if(dRecord['id'] === -1){
      this.addFavoritesWebsite(dRecord, mCallbackFunction);
    } else {
      var lFavorites = JSON.parse(localStorage['ct-favorites_webistes']);
      for(var i = 0; i < lFavorites.length; i++){
        if(lFavorites[i]['id'] === dRecord['id']){
          lFavorites[i] = dRecord;
        }
      }
      localStorage['ct-favorites_webistes'] = JSON.stringify(lFavorites);
    }
  },

});

Cotton.CONTROLLER = new Cotton.Controller();
