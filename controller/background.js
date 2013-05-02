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
  _wDBSCAN2 : null,

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
   * Story to be displayed in lightyear
   **/
   _iTriggerStory : null,

  /**
   * ids of stories for all open tabs
   **/
   _lStoriesInTabsId : null,

  /**
   * id of the tab from which the browserAction was clicked
   **/
  _iCallerTabId : null,

  /**
   * boolean that indicates if everything is set for installation or update
   **/
  _bReadyForStart : null,

  /**
   * boolean that indicates if installation has been launched already
   **/
  _bInstallLaunched : null,

  /**
   * boolean that indicates if update has been launched already
   **/
  _bUpdated : null,

  /**
   * boolean that indicates if background is ready for treating content script messages
   * in particular, are we done with installation.
   **/
  _bReadyForMessaging : null,

  /**
   *
   */
  init : function(){
    var self = this;
    self._bReadyForStart = false;
    self._bInstallLaunched = false;
    self._bUpdated = false;
    self._bReadyForMessaging = false;

    chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
      Cotton.ONEVENT = oInstallationDetails['reason'];
      DEBUG && console.debug("chrome runtime " + Cotton.ONEVENT);
      if (self._bReadyForStart && !self._bInstallLaunched && Cotton.ONEVENT === 'install'){
        self.install();
      } else if (self._bReadyForStart && !self._bUpdated && Cotton.ONEVENT === 'update'){
        self.update();
      } else if (self._bReadyForStart && !self._bInstallLaunched && !self._bUpdated){
        self._bReadyForMessaging = true;
      }
    });

    this._dGetContentTabId = {};
    this._lStoriesInTabsId = [];

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
        self._oContentScriptListener = new Cotton.Controllers.BackgroundListener(self._oMessagingController, self);

          DEBUG && console.debug('Global store created');
          if (!self._bInstallLaunched && Cotton.ONEVENT === 'install') {
            self.install();
          } else if(!self._bUpdated && Cotton.ONEVENT === 'update'){
            self._bUpdated = true;
            self.update();
          } else if (!self._bInstallLaunched && !self._bUpdated){
            self._bReadyForMessaging = true;
          }
    });

    chrome.browserAction.onClicked.addListener(function() {
      // chrome.tabs.getSelected is now deprecated. chrome.tabs.query is used instead
      chrome.tabs.query({
        'highlighted':true,
        'lastFocusedWindow': true
      }, function(lTabs){
        self._iCallerTabId = lTabs[0]['id'];
      });
      chrome.tabs.query({}, function(lTabs){
        var iOpenTabs = lTabs.length;
        var iCount = 0;
        for (var i = 0, oTab; oTab = lTabs[i]; i++){
          self.getStoryFromTab(oTab, function(){
            iCount++;
            if (iCount === iOpenTabs){
              chrome.tabs.create({
                'url': 'lightyear.html'
              });
            }
          });
        }
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
   * Install
   *
   * First installation, the database is empty. Need to populate. Then launch,
   * DBSCAN1 on the results.
   *
   */
  install : function(){
    var self = this;
    DEBUG && console.debug("Controller - install");
    self._bInstallLaunched = true;
    var date = new Date();
    var month = date.getMonth() + 1;
    localStorage.setItem('cohort', month + "/" + date.getFullYear());
    Cotton.ANALYTICS.setCohort(month + "/" + date.getFullYear());
    self._startTime = date.getTime();
  },

  /**
   * Update
   *
   * If something is needed. But nothing for the moment.
   */
  update : function(){
    DEBUG && console.debug("update");
    this._bReadyForMessaging = true;
  },

  addGetContentTab : function (iTabId) {
    this._dGetContentTabId[iTabId] = true;
    DEBUG && console.debug(this._dGetContentTabId);
  },

  removeGetContentTab : function (iTabId) {
    delete this._dGetContentTabId[iTabId];
    chrome.tabs.remove(iTabId);
  },

  setTriggerStory : function(iStoryId){
    this._iTriggerStory = iStoryId;
  },

  setOtherStories : function(){
    var self = this;
    self._lStoriesInTabsId = [];
    chrome.tabs.query({}, function(lTabs){
      var iOpenTabs = lTabs.length;
      var iCount = 0;
      for (var i = 0, oTab; oTab = lTabs[i]; i++){
        self.getStoryFromTab(oTab);
      }
    });
  },

  getStoryFromTab : function(oTab, mCallback){
    var self = this;
    var sUrl = oTab['url'];
    var bTrigger = (oTab['id'] === self._iCallerTabId);
    var oUrl = new UrlParser(sUrl);
    if (oUrl.isGoogle && oUrl.dSearch && oUrl.dSearch['tbm'] === 'isch'){
      if (oUrl.searchImage){
         sUrl = oUrl.searchImage;
       } else {
         sUrl = oUrl.genericSearch + "&tbm=isch";
       }
    } else if (oUrl.isGoogle && oUrl.keywords){
      sUrl = oUrl.genericSearch;
    }
    self._oDatabase.find('historyItems',
    'sUrl', sUrl, function(_oHistoryItem){
      if(_oHistoryItem && _oHistoryItem.storyId() !== "UNCLASSIFIED" ){
        if (bTrigger){
          self._iTriggerStory = _oHistoryItem.storyId();
        } else{
          if (self._lStoriesInTabsId.indexOf(_oHistoryItem.storyId()) === -1
            && _oHistoryItem.storyId() !== self._iTriggerStoryId){
              self._lStoriesInTabsId.push(_oHistoryItem.storyId());
          }
        }
      } else if (bTrigger){
        if (!_oHistoryItem){
          var oUrl = new UrlParser(sUrl);
          var oExcludeContainer = new Cotton.Utils.ExcludeContainer();
          if (oExcludeContainer.isHttps(oUrl)){
            self._iTriggerStory = -1;
          } else {
            self._iTriggerStory = null;
          }
        } else {
          self.forceStory(_oHistoryItem.id(), self._oPool.get(), function(iStoryId){
            self._iTriggerStory = iStoryId;
          });
        }
      }
      if (mCallback){
        mCallback.call(self);
      }
    });
  }

});

Cotton.BACKGROUND = new Cotton.Controllers.Background();

