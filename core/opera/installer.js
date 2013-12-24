'use strict';

Cotton.Core.Installer = Class.extend({

  _oDatabase : null,

  /**
   * call back method called when the installation is finished.
   */
  _mCallback : null,

  /**
   * Worker to make the algo part in different thread.
   */
  _wInstallWorker : null,

  init: function(oDatabase, mCallback) {
    var self = this;
    self._oDatabase = oDatabase;
    self._mIsFinished = mCallback;

    self.notifyHomepage();
    if (chrome.history) {
      // chrome.history API is supported, we can run DBSCAN1
      self.initInstallWorker();
      // When everything is ready call the install.
      self.historyInstall();
    } else {
      // No history API, older version of Opera
      self.emptyInstall();
    }

  },

  /**
   * Install
   *
   * Quick install for old versions of Opera, without the chrome.history API
   *
   */
  emptyInstall : function(mCallback){
    var self = this;

    // Disable the button and open the howTo page.
    chrome.tabs.create({'url': 'http://www.cottontracks.com/install.html'});
    DEBUG && console.debug("Controller - install");
    self._mIsFinished();
  },

  /**
   * Initialize the worker in charge of DBSCAN3,
   * Called at the installation on all the element of historyItems.
   */
   initInstallWorker : function() {
    var self = this;
    // Instantiate a new worker with the code in the specified file.
    self._wInstallWorker = new Worker('algo/dbscan3/worker_dbscan3.js');
    var lStories = [];
    var iSessionCount = 0;
    var iTotalSessions = 0;
    var lHistoryItemsIds = [];
    var lHistoryItems = [];

    // Add listener called when the worker send message back to the main thread.
    self._wInstallWorker.addEventListener('message', function(e) {
      if (e.data['iTotalSessions']) {
        iTotalSessions = e.data['iTotalSessions'];
      } else {
        iSessionCount++;
        DEBUG && console.debug('wDBSCAN - Worker ends: ',
          e.data['iNbCluster'], e.data['lHistoryItems']);

        var lNewStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
                                                e.data['iNbCluster']);

        // This part is used to merge stories when they have a common
        // historyItem or a the same title (same words even with different
        // order.)
        // FIXME(rmoutard) : take a lot of time.

        // For all the new stories
        var iLength = lNewStories.length;
        for (var i = 0; i < iLength; i++) {
          var oNewStory = lNewStories[i];
          // Find among all the stories we already have one that could be merged with.
          var lMergedStories = [];
          var jLength = lStories.length;
          for (var j = 0; j < jLength; j++) {
            var oStoredStory = lStories[j];
            // TODO(rkorach) : do not use _.intersection
            if (_.intersection(oNewStory.historyItemsId(), oStoredStory.historyItemsId()).length > 0 ||
              (oNewStory.tags().length > 0
              && oNewStory.tags().length === oStoredStory.tags().length
              && oNewStory.tags().join().length === oStoredStory.tags().join().length
              && oNewStory.tags().sort().join() === oStoredStory.tags().sort().join())) {
                // there is an item in two different stories or they have the same words
                // in the title
                oNewStory.setHistoryItemsId(
                  _.union(oNewStory.historyItemsId(),oStoredStory.historyItemsId()));
                oNewStory.setLastVisitTime(Math.max(
                  oNewStory.lastVisitTime(),oStoredStory.lastVisitTime()));
                oNewStory.dna().bagOfWords().mergeBag(oStoredStory.dna().bagOfWords().get());
                if (!oNewStory.featuredImage() || oNewStory.featuredImage() === "") {
                  oNewStory.setFeaturedImage(oStoredStory.featuredImage());
                }
            } else {
              lMergedStories.push(oStoredStory);
            }
          }
          lMergedStories.push(oNewStory);
          lStories = lMergedStories;
        }

        var iLength = e.data['lHistoryItems'].length;
        for (var i = 0; i < iLength; i++) {
          var dHistoryItem = e.data['lHistoryItems'][i];
          if (lHistoryItemsIds.indexOf(dHistoryItem['id']) === -1) {
            lHistoryItemsIds.push(dHistoryItem['id']);
            // Data sent by the worker are serialized. Deserialize using translator.
            var oTranslator = self._oDatabase._translatorForDbRecord('historyItems',
              dHistoryItem);
            var oHistoryItem = oTranslator.dbRecordToObject(dHistoryItem);
            lHistoryItems.push(oHistoryItem);
          }
        }

        if (iTotalSessions && iSessionCount === iTotalSessions) {
          // PopulateDB.visitItems ensure that the callback function is called
          // only when all visitItems are in the database.
          Cotton.ANALYTICS.newStory(lStories.length);
          // Add stories in IndexedDB, and update corresponding historyItems.
          if (lStories.length == 0) {
            // Stop the installation.
            self.installIsFinished();
          } else {
            Cotton.DB.populateDBFromInstall(self._oDatabase, lStories.reverse(), self._lHistoryItems,
              function(_lStories, _lHistoryItems, _lSearchKeywords) {
                // Purge lStories.
                var iLength = lStories.length;
                for (var i = 0; i < iLength; i++) {
                  lStories[i] = null;
                }
                lStories = [];
                _lStories = [];
                _lHistoryItems = [];
                _lSearchKeywords = [];
                self.installIsFinished();
            });
          }
        }

        // Purge :
        var iLength = e.data['lHistoryItems'].length;
        for (var i = 0; i < iLength; i++) {
          e.data['lHistoryItems'][i] = null;
        }
        e.data['lHistoryItems'] = [];
        e.data['iNbCluster'] = null;
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
  historyInstall : function(mCallback){
    var self = this;

    // Disable the button and open the howTo page.
    chrome.browserAction.disable();
    chrome.tabs.create({'url': 'http://www.cottontracks.com/howto.html'});

    DEBUG && console.debug("Controller - install");
    self._oBenchmark = new Benchmark("Installation");

    // FIXME(rmoutard->rkorach) : I think we don't need it anymore.
    // Make sure the background page is keeped opened during installation.
    self.wakeUp();

    self._oTempDatabase = new Cotton.Core.TempDatabase(self._oDatabase);
    self._oTempDatabase.populate(function(lHistoryItems, lVisitItems) {
      self._lHistoryItems = lHistoryItems;
      DEBUG && console.debug('GetHistory returns: '
        + lHistoryItems.length + ' historyItems and '
        + lVisitItems.length + ' visitItems:');
      Cotton.ANALYTICS.newHistoryItem(lHistoryItems.length);
      Cotton.ANALYTICS.newVisitItem(lVisitItems.length);
      DEBUG && console.debug(lHistoryItems, lVisitItems);
      // visitItems are already dictionnaries, whereas historyItems are objects
      self.lHistoryItemsDict = [];
      var iLength = lHistoryItems.length;
      for (var i = 0, oItem; i < iLength; i++) {
        var oItem = lHistoryItems[i];
        // maybe a setFormatVersion problem
        var oTranslator = self._oDatabase._translatorForObject('historyItems', oItem);
        var dItem = oTranslator.objectToDbRecord(oItem);
        self.lHistoryItemsDict.push(dItem);
      }
      // Purge.
      lHistoryItems = [];
      DEBUG && console.debug(self.lHistoryItemsDict);
      self._wInstallWorker.postMessage({
        'historyItems' : self.lHistoryItemsDict,
        'visitItems' : lVisitItems
      });
    });

  },

  /**
   * Notify cT homepage that the install has been performed, to change the "install" button
   */
  notifyHomepage : function() {
    chrome.tabs.query({'url': 'http://cottontracks.com/*'}, function(lTabs){
      var iLength = lTabs.length;
      for (var i = 0; i < iLength; i++) {
        chrome.tabs.executeScript(lTabs[i]['id'],{
          code: 'var oInstallEvent = new Event("install"); window.dispatchEvent(oInstallEvent);'
        });
      }
    });
  },

  /**
   * HACK
   * As long as the install and population of the database is not finished, we
   * regularly call the background page to keep it awake.
   */
  wakeUp : function() {
    var self = this;
    chrome.runtime.getBackgroundPage(function(oPage){});
    if (!this._bStopWakeUp) {
      DEBUG && console.debug('wake up!');
      setTimeout(function(){
        self.wakeUp();
      }, 5000);
    }
  },

  /**
   * Called this method when the installation is over.
   * It stops the benchmark, enable the button, and apply the callback.
   */
  installIsFinished : function() {
    this.purge();
    this._oBenchmark.end(function(iDuration) {
      Cotton.ANALYTICS.installTime(iDuration);
    });
    chrome.browserAction.enable();
    this._bStopWakeUp = true;
    this._mIsFinished();
  },

  /**
   * Unreferenced all elements, so the Garbage collector can collect
   * them at the next loop.
   */
  purge : function() {
    this._oTempDatabase.purge();
    this._oTempDatabase = null;
    this._wInstallWorker = null;
    delete Cotton.Core.TempDatabase;
    var iLength = this.lHistoryItemsDict.length;
    for (var i = 0; i < iLength; i++) {
      this.lHistoryItemsDict[i] = null;
      this._lHistoryItems[i] = null;
    }
    this.lHistoryItemsDict = [];
    this._lHistoryItems = [];
  }

});
