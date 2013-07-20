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
   * MessagingController
   */
  _oMessagingController : null,

  /**
   * Core messenger
   */
  _oMessenger : null,

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
   * id of the HistoryItem from which lightyear was called
   **/
   _iTriggerHistoryItem : null,

  /**
   * ids of stories for all open tabs
   **/
   _lStoriesInTabsId : null,

  /**
   * id of the tab from which the browserAction was clicked
   **/
  _iCallerTabId : null,

  /**
   * boolean that indicates if update has been launched already
   **/
  _bUpdated : null,

  /**
   *
   */
  init : function(){
    var self = this;
    self._bUpdated = false;

    this._dGetContentTabId = {};
    this._lStoriesInTabsId = [];

    chrome.runtime.onInstalled.addListener(function(details) {
      var sVersion = chrome.app.getDetails()['version'];
      switch (details){
        case 'install':
          Cotton.ANALYTICS.install(sVersion);
          break;
        case 'update':
          Cotton.ANALYTICS.update(sVersion);
          break;
        case 'chrome_update':
          break;
        default:
          break;
      }
    });

    this._oMessenger = new Cotton.Core.Messenger();

    self.initWorkerDBSCAN2();
    // Initialize the pool.
    self._oPool = new Cotton.DB.DatabaseFactory().getCache('pool');
    self._oSearchCache = new Cotton.DB.DatabaseFactory().getCache('search');
    //TODO(rmoutard): do not put this here.
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

        DEBUG && console.debug('Global store created');

        // Init the messaging controller.
        self._oMessagingController = new Cotton.Controllers.Messaging(self);
        self._oContentScriptListener = new Cotton.Controllers.BackgroundListener(self._oMessagingController, self);

        self.installIfNeeded(function(){
          // Do when the installation is finished.
          self._bReadyForMessaging = true;
        });
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
      //wake up
    });

    chrome.browserAction.onClicked.addListener(function() {
      self._iTriggerHistoryItem = -1;
      // chrome.tabs.getSelected is now deprecated. chrome.tabs.query is used instead
      chrome.tabs.query({
        'active':true,
        'lastFocusedWindow': true
      }, function(lTabs){
        var sCallerTabUrl = lTabs[0]['url'];
        if (sCallerTabUrl.indexOf(chrome.extension.getURL('lightyear.html')) !== -1){
          // we are in lightyear, so the UI page will listen to the event
          // go back to the manager. do nothing from background
        } else {
          Cotton.ANALYTICS.showLightyear();
          self._iCallerTabId = lTabs[0]['id'];
          var iCallerTabIndex = lTabs[0]['index'];
          chrome.tabs.query({}, function(lTabs){
            var iOpenTabs = lTabs.length;
            var iCount = 0;

            // we authorize one cT tab per window
            chrome.windows.getLastFocused({}, function(oWindow){
              var iCurrentWindow = oWindow['id'];
              for (var i = 0, oTab; oTab = lTabs[i]; i++){
                if (oTab['url'].indexOf(chrome.extension.getURL('lightyear.html')) !== -1
                  && oTab['windowId'] === iCurrentWindow){
                    var oCottonTab = oTab;
                }
                self.getStoryFromTab(oTab, function(){
                  iCount++;
                  if (iCount === iOpenTabs){
                    for (var i = 0, iStoryInTabsId; iStoryInTabsId = self._lStoriesInTabsId[i]; i++){
                      if (iStoryInTabsId === self._iTriggerStory){
                        self._lStoriesInTabsId.splice(i,1);
                        i--;
                      }
                    }
                    if (oCottonTab){
                      chrome.tabs.remove(oCottonTab['id']);
                    }
                    chrome.tabs.create({
                      'url': 'lightyear.html',
                      'index': iCallerTabIndex + 1,
                      'openerTabId': self._iCallerTabId
                    });
                    if (sCallerTabUrl === "chrome://newtab/"){
                      // put after the create method
                      // because we need the tab to be open to have it id as an referrer
                      chrome.tabs.remove(self._iCallerTabId);
                    }
                  }
                });
              }
            });
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
      var lStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
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
      Cotton.DB.Stories.addStories(self._oDatabase, lStories,
        function(oDatabase, lStories){
          if (lStories && lStories.length > 0){
            Cotton.ANALYTICS.storyAvailable('pool');
          }
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
    if (dSeed){
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
            Cotton.ANALYTICS.storyAvailable('forced');
            mCallback.call(self, lStories[0].id());
          }
      });
    } else {
      // the item has not been put in the pool - because the browserAction has been clicked
      // too early, or because there has been a problem with content script message.
      mCallback.call(self, 0);
    }
  },

   /**
   * InstallIfNeeded
   * Check the state of the database to determine whether or not we need to
   * install the application. If the "historyItems" store is empty, we are
   * considering that the application need to be installed. The when the
   * installation is finished, or if there is nothing to do, call the callback
   * directly.
   *
   * {Function} mCallback : function called when
   */
  installIfNeeded : function(mCallback){
    var self = this;
    self._oDatabase.empty('historyItems', function(bIsEmpty){
      if(bIsEmpty){
        // As we are in a callback function of the database this is the database
        // we access it faster using 'this' than self._oDatabase.
        var oInstaller = new Cotton.Core.Installer(this, mCallback);
      } else {
        mCallback();
      }
    });
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

  setOtherStories : function(mCallback){
    var self = this;
    self._lStoriesInTabsId = [];
    chrome.tabs.query({}, function(lTabs){
      var iOpenTabs = lTabs.length;
      var iCount = 0;
      for (var i = 0, oTab; oTab = lTabs[i]; i++){
        self.getStoryFromTab(oTab, function(){
          iCount++;
          if (iCount === iOpenTabs){
            for (var i = 0, iStoryInTabsId; iStoryInTabsId = self._lStoriesInTabsId[i]; i++){
              if (iStoryInTabsId === self._iTriggerStory){
                self._lStoriesInTabsId.splice(i,1);
                i--;
              }
            }
            mCallback.call(self);
          }
        });
      }
    });
  },

  resetHistoryItem : function(){
    this._iTriggerHistoryItem = -1;
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
          self._iTriggerHistoryItem = _oHistoryItem.id();
        } else{
          if (self._lStoriesInTabsId.indexOf(_oHistoryItem.storyId()) === -1
            && _oHistoryItem.storyId() !== self._iTriggerStory){
              self._lStoriesInTabsId.push(_oHistoryItem.storyId());
          }
        }
        if (mCallback){
          mCallback.call(self);
        }
      } else if (bTrigger){
        if (!_oHistoryItem){
          var oUrl = new UrlParser(sUrl);
          var oExcludeContainer = new Cotton.Utils.ExcludeContainer();
          if (oExcludeContainer.isHttps(oUrl)){
            self._iTriggerStory = -1;
          }
          if (mCallback){
            mCallback.call(self);
          }
        } else {
          self.forceStory(_oHistoryItem.id(), self._oPool.get(), function(iStoryId){
            self._iTriggerStory = iStoryId;
            if (mCallback){
              mCallback.call(self);
            }
          });
        }
      } else {
        if (mCallback){
          mCallback.call(self);
        }
      }
    });
  }

});

Cotton.Controllers.BACKGROUND = new Cotton.Controllers.Background();

