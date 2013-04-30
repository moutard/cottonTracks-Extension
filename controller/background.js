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
   * boolean that indicates if everything is set for installation or update
   **/
  _bReadyForStart : null,

  /**
   * boolean that indicates if installation has been launched already
   **/
  _bInstalled : null,

  /**
   * boolean that indicates if update has been launched already
   **/
  _bUpdated : null,

  /**
   *
   */
  init : function(){
    var self = this;
    self._bReadyForStart = false;
    self._bInstalled = false;
    self._bUpdated = false;

    chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
      Cotton.ONEVENT = oInstallationDetails['reason'];
      DEBUG && console.debug("chrome runtime" + Cotton.ONEVENT);
      if (self._bReadyForStart && !self._bInstalled && Cotton.ONEVENT === 'install'){
        self.install();
      } else if (self._bReadyForStart && !self._bUpdated && Cotton.ONEVENT === 'update'){
        self._bInstalled = true;
        self.update();
      } else {
        // pass
      }
    });

    this._dGetContentTabId = {};
    this._dTabStory = {};

    chrome.browserAction.disable();
    self.initWorkerDBSCAN3();
    self.initWorkerDBSCAN2();

    // Initialize the pool.
    self._oPool = new Cotton.DB.DatabaseFactory().getCache('pool');
    self._oSearchCache = new Cotton.DB.DatabaseFactory().getCache('search');
    if (localStorage.getItem('blacklist-expressions')){
      Cotton.Algo.Common.Words.setBlacklistExpressions(
        JSON.parse(localStorage.getItem('blacklist-expressions')));
    }

     // Initialize the indexeddb Database.
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {
        self._bReadyForStart = true;

        // Init the messaging controller.
        self._oMessagingController = new Cotton.Controllers.Messaging(self);
        self._oContentScriptListener = new Cotton.Controllers.BackgroundListener(self._oMessagingController);

          DEBUG && console.debug('Global store created');
          if (!self._bInstalled && Cotton.ONEVENT === 'install') {
            self.install();
          } else if(!self._bUpdated && Cotton.ONEVENT === 'update'){
            self._bUpdated = true;
            self.update();
          } else {
            // pass
          }
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
      if (changeInfo['status'] === 'loading'){
        chrome.browserAction.disable(tabId);
      }
    });

    chrome.browserAction.onClicked.addListener(function() {
      self.takeScreenshot();
      // chrome.tabs.getSelected is now deprecated. chrome.tabs.query is used instead
      chrome.tabs.query({
        'highlighted':true,
        'lastFocusedWindow': true
      }, function(lTabs){
        var sUrl = lTabs[0]['url'];
        var oUrl = new UrlParser(sUrl);
        if (oUrl.isGoogle && oUrl.keywords){
          sUrl = oUrl.genericSearch;
        }
        self._oDatabase.find('historyItems',
        'sUrl', sUrl, function(_oHistoryItem){
          if(_oHistoryItem && _oHistoryItem.storyId() !== "UNCLASSIFIED" ){
            self._iTriggerStory = _oHistoryItem.storyId();
            chrome.tabs.update(lTabs[0].id, {'url':'lightyear.html'},function(){
              // TODO(rkorach) : delete ct page from history
            });
          } else {
            self.forceStory(_oHistoryItem.id(), self._oPool.get(), function(iStoryId){
              self._iTriggerStory = iStoryId;
              chrome.tabs.update(lTabs[0].id, {'url':'lightyear.html'},function(){
                // TODO(rkorach) : delete ct page from history
              });
            });
          }
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
          chrome.browserAction.enable(e.data['iSenderTabId']);
      });
    }, false);

    return wDBSCAN2;
  },

  /**
   * Creates a story around an item, without minimum limit of number
   */
  forceStory : function(iSeedId, lItems, mCallback) {
    var self = this;
    var mDistance = Cotton.Algo.Score.DBRecord.HistoryItem;
    var fEps = Cotton.Config.Parameters.dbscan2.fEps;
    for (var i = 0, dItem; dItem = lItems[i]; i++){
      dItem['clusterId'] = "UNCLASSIFIED";
      if (dItem['id'] === iSeedId) {
        var dSeed = dItem;
      }
    }
    for (var i = 0, dItem; dItem = lItems[i]; i++){
      if (mDistance(dItem, dSeed) >= fEps || dItem['id'] === dSeed['id']) {
        dItem['clusterId'] = 0;
      }
    }
    var lNewStory = Cotton.Algo.clusterStory(lItems, 1)['stories'];
    // TODO(rmoutard) : find a better solution.
    var lHistoryItemToKeep = [];
    for (var i = 0, dItem; dItem = lItems[i]; i++){
      if(dItem['clusterId'] === "UNCLASSIFIED"){
          delete dItem['clusterId'];
          lHistoryItemToKeep.push(dItem);
      }
    }
    self._oPool._refresh(lHistoryItemToKeep);
    Cotton.DB.Stories.addStories(self._oDatabase, lNewStory,
      function(oDatabase, lStories){
        if (lStories.length > 0){
          mCallback.call(self, lStories[0].id());
        }
    });


  },

  /**
   * Initialize the worker in charge of DBSCAN3,
   * Called at the installation on all the element of historyItems.
   */
  initWorkerDBSCAN3 : function() {
    var self = this;
    // Instantiate a new worker with the code in the specified file.
    self._wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');
    var lStories = [];
    var iSessionCount = 0;
    var iTotalSessions = 0;
    var lHistoryItemsIds = [];
    var lHistoryItems = [];

    // Add listener called when the worker send message back to the main thread.
    self._wDBSCAN3.addEventListener('message', function(e) {
      if (e.data['iTotalSessions']){
        iTotalSessions = e.data['iTotalSessions'];
      } else {
        iSessionCount++;
        DEBUG && console.debug('wDBSCAN - Worker ends: ',
          e.data['iNbCluster'], e.data['lHistoryItems']);

        var dStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
                                                e.data['iNbCluster']);

        for (var i = 0, oStory; oStory = dStories['stories'][i]; i++){
          var oMergedStory = oStory;
          for (var j = 0, oStoredStory; oStoredStory = lStories[j]; j++){
            // TODO(rkorach) : do not use _.intersection
            if (_.intersection(oStory.historyItemsId(),oStoredStory.historyItemsId()).length > 0 ||
              (oStory.tags().sort().join() === oStoredStory.tags().sort().join()
              && oStory.tags().length > 0)){
                // there is an item in two different stories or they have the same words
                // in the title
                oMergedStory.setHistoryItemsId(
                  _.union(oMergedStory.historyItemsId(),oStoredStory.historyItemsId()));
                oMergedStory.setLastVisitTime(Math.max(
                  oMergedStory.lastVisitTime(),oStoredStory.lastVisitTime()));
                lStories.splice(j,1);
                if (!oMergedStory.featuredImage() || oMergedStory.featuredImage() === ""){
                  oMergedStory.setFeaturedImage(oStoredStory.featuredImage());
                }
                j--;
            }
          }
          lStories.push(oMergedStory);
        }

        for (var i = 0, dHistoryItem; dHistoryItem = e.data['lHistoryItems'][i]; i++){
          if (lHistoryItemsIds.indexOf(dHistoryItem['id']) === -1){
            lHistoryItemsIds.push(dHistoryItem['id']);
            // Data sent by the worker are serialized. Deserialize using translator.
            var oTranslator = self._oDatabase._translatorForDbRecord('historyItems',
              dHistoryItem);
            var oHistoryItem = oTranslator.dbRecordToObject(dHistoryItem);
            lHistoryItems.push(oHistoryItem);
          }
        }

        if (iTotalSessions && iSessionCount === iTotalSessions){
          // add items in indexedDB, then stories. We need to wait for the historyItems
          // to be in base because when putting the stories we update iStoryId in the base
          self._oDatabase.putListUniqueHistoryItems('historyItems', lHistoryItems, function(lIds) {
            // Add stories in IndexedDB.
            Cotton.DB.Stories.addStories(self._oDatabase, lStories,
              function(oDatabase, lStories){
                var d = new Date();
                var _endTime = d.getTime();
                var elapsedTime = (_endTime - self._startTime) / 1000;
                DEBUG && console.debug("time elapsed during installation: "
                  + elapsedTime + "ms");
                self._bInstallFinished = true;
            });
          });
        }
      }
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
    self._bInstalled = true;
    var date = new Date();
    var month = date.getMonth() + 1;
    localStorage.setItem('cohort', month + "/" + date.getFullYear());
    self._startTime = date.getTime();
    self.wakeUp();
    var oChromeHistoryClient = new Cotton.Core.Chrome.History.Client();
    Cotton.DB.Populate.visitItems(oChromeHistoryClient, function(
      lHistoryItems, lVisitItems) {
        DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
          + lHistoryItems.length + ' historyItems and '
          + lVisitItems.length + ' visitItems:');
        DEBUG && console.debug(lHistoryItems, lVisitItems);
        // visitItems are already dictionnaries, whereas historyItems are objects
        var lHistoryItemsDict = [];
        for(var i = 0, oItem; oItem = lHistoryItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = self._oDatabase._translatorForObject('historyItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lHistoryItemsDict.push(dItem);
        }
        DEBUG && console.debug(lHistoryItemsDict);
        self._wDBSCAN3.postMessage({
          'historyItems' : lHistoryItemsDict,
          'visitItems' : lVisitItems
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
    DEBUG && console.debug(this._dGetContentTabId);
  },

  removeGetContentTab : function (iTabId) {
    delete this._dGetContentTabId[iTabId];
    chrome.tabs.remove(iTabId);
  },

  wakeUp : function(){
    var self = this;
    /*
     * HACK
     */
    // as long as the install and population of the database is not finished
    // we regularly call the background page to keep it awake
    chrome.runtime.getBackgroundPage(function(oPage){});
    if (!this._bInstallFinished){
      DEBUG && console.debug('wake up!');
      setTimeout(function(){
        self.wakeUp();
      }, 5000);
    }
  },

  setTriggerStory : function(iStoryId){
    this._iTriggerStory = iStoryId;
  }
});

Cotton.BACKGROUND = new Cotton.Controllers.Background();

