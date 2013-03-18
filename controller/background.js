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
   * the database. So it Contains 'historyItems' and 'stories'.
   */
  _oDatabase : null,

  /**
   * Specific cache database in localStorage that contains all the important
   * historyItems that can be used to generate a story.
   */
  _oPool : null,

  /**
   * Worker to make the algo part in different thread.
   */
  _wDBSCAN3 : null,
  _wDBSCAN2 : null,

  _sScreenshotSrc : null,

  /**
   * MessagingController
   */
  _oMessagingController : null,

 /**
   * MessagingController
   */
  _oContentScriptListener : null,

 /**
  * data of tabs opened for getContent
  **/
  _dGetContentTabId : null,

 /**
  * data of tabs and their HistoryItems
  **/
  _dTabStory : null,

 /**
  * Story to be displayed in lightyear
  **/
  _iTriggerStory : null,

  /**
   * @constructor
   */
  init : function(){
    var self = this;

    this._dGetContentTabId = {};
    this._dTabStory = {};

    chrome.browserAction.disable();
    self.initWorkerDBSCAN3();
    self.initWorkerDBSCAN2();

    // Initialize the pool.
    self._oPool = new Cotton.DB.DatabaseFactory().getPool();

     // Initialize the indexeddb Database.
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {

        // Init the messaging controller.
        self._oMessagingController = new Cotton.Controllers.Messaging(self);
        self._oContentScriptListener = new Cotton.Controllers.BackgroundListener(self._oMessagingController);

          DEBUG && console.debug('Global store created');
          if (Cotton.ONEVENT === 'install') {
            self.install();
          } else if(Cotton.ONEVENT === 'update'){
            self.update();
          } else {
            // pass
          }
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
      chrome.browserAction.disable(tabId);
      self.removeTabStory(tabId);
    });

    chrome.browserAction.onClicked.addListener(function() {
      self.takeScreenshot();
      // chrome.tabs.getSelected is now deprecated. chrome.tabs.query is used instead
      chrome.tabs.query({'active':true, 'currentWindow': true}, function(lTabs){
	self._iTriggerStory = self._dTabStory[lTabs[0].id];
        chrome.tabs.update(lTabs[0].id, {'url':'lightyear.html'},function(){
	      // TODO(rkorach) : delete ct page from history
	      });
	    });
    });
  },

  /**
   * Initialize the worker in charge of DBSCAN2,
   * Called by the background to all the historyItems elements that are in the
   * pool.
   */
  initWorkerDBSCAN2 : function() {
    var self = this;
    // Instantiate a new worker with the code in the specified file.
    var wDBSCAN2 = new Worker('algo/dbscan2/worker_dbscan2.js');

    // Add listener called when the worker send message back to the main thread.
    wDBSCAN2.addEventListener('message', function(e) {

      DEBUG && console.debug('wDBSCAN2 - Worker ends: ',
        e.data['iNbCluster'], e.data['lHistoryItems']);

      // Cluster the story found by dbscan2.
      var dStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
                                              e.data['iNbCluster']);

      // TODO(rmoutard) : find a better solution.
      var lHistoryItemToKeep = [];
      for (var i = 0, iLength = e.data['lHistoryItems'].length; i < iLength; i++){
        var dHistoryItem = e.data['lHistoryItems'][i];
        if(dHistoryItem['sStoryId'] === "UNCLASSIFIED"
          && dHistoryItem['clusterId'] === "NOISE"){
            delete dHistoryItem['clusterId'];
            lHistoryItemToKeep.push(dHistoryItem);
        }
      }
      self._oPool._refresh(lHistoryItemToKeep);

      // Add stories in indexedDB.
      Cotton.DB.Stories.addStories(self._oDatabase, dStories['stories'],
          function(oDatabase, lStories){
            // pass.
      });
    }, false);

    return wDBSCAN2;
  },

  /**
   * Initialize the worker in charge of DBSCAN3,
   * Called at the installation on all the element of historyItems.
   */
  initWorkerDBSCAN3 : function() {
    var self = this;
    // Instantiate a new worker with the code in the specified file.
    self._wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

    // Add listener called when the worker send message back to the main thread.
    self._wDBSCAN3.addEventListener('message', function(e) {

      DEBUG && console.log('wDBSCAN - Worker ends: ',
        e.data['iNbCluster'], e.data['lHistoryItems']);

      // Update the historyItems with extractedWords and queryWords.
      for (var i = 0, iLength = e.data['lHistoryItems'].length; i < iLength; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oDatabase._translatorForDbRecord('historyItems',
          e.data['lHistoryItems'][i]);
        var oHistoryItem = oTranslator.dbRecordToObject(e.data['lHistoryItems'][i]);

        self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function() {
          // pass.
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
                                              e.data['iNbCluster']);

      // Add stories in IndexedDB.
      Cotton.DB.Stories.addStories(self._oDatabase, dStories['stories'],
          function(oDatabase, lStories){
            // pass.
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

    Cotton.DB.Populate.historyItems(self._oDatabase, function(oDatabase) {
      oDatabase.getList('historyItems', function(lAllHistoryItems) {
        DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
            + lAllHistoryItems.length + ' items');
        DEBUG && console.debug(lAllHistoryItems);
        var lAllVisitDict = [];
        for(var i = 0, oItem; oItem = lAllHistoryItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = this._translatorForObject('historyItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lAllVisitDict.push(dItem);
        }
        DEBUG && console.debug(lAllVisitDict);
        self._wDBSCAN3.postMessage(lAllVisitDict);
      });
    });

  },


  /**
   * return the sreenshot url saved in chrome.
   */
  screenshot : function() {
    return this._sScreenshotSrc;
  },
  /**
   * Takes a screenshot of the visible tab through chrome tabs api.
   */
  takeScreenshot : function() {
    self = this;
    chrome.tabs.captureVisibleTab(function(img) {
      self._sScreenshotSrc = img;
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

  addGetContentTab : function (iTabId) {
    this._dGetContentTabId[iTabId] = true;
    console.log(this._dGetContentTabId);
  },

  removeGetContentTab : function (iTabId) {
    delete this._dGetContentTabId[iTabId];
    chrome.tabs.remove(iTabId);
  },

  setTabStory : function (iTabId, iStoryId) {
    this._dTabStory[iTabId] = iStoryId;
  },

  removeTabStory : function (iTabId) {
    if (this._dTabStory[iTabId]){
      delete this._dTabStory[iTabId];
    }
  }
});

chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
  Cotton.ONEVENT = oInstallationDetails['reason'];
});

Cotton.BACKGROUND = new Cotton.Controllers.Background();

