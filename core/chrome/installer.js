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
    self._mCallback = mCallback;

    self.initInstallWorker();
    // When everything is ready call the install.
    self.install();
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
        for (var i = 0, oMergedStory; oMergedStory = lNewStories[i]; i++) {
          // Find among all the stories we already have one that could be merged with.
          for (var j = 0, oStoredStory; oStoredStory = lStories[j]; j++) {
            // TODO(rkorach) : do not use _.intersection
            if (_.intersection(oMergedStory.historyItemsId(), oStoredStory.historyItemsId()).length > 0 ||
              (oMergedStory.tags().length > 0
               && oMergedStory.tags().sort().join() === oStoredStory.tags().sort().join())) {
                // there is an item in two different stories or they have the same words
                // in the title
                oMergedStory.setHistoryItemsId(
                  _.union(oMergedStory.historyItemsId(),oStoredStory.historyItemsId()));
                oMergedStory.setLastVisitTime(Math.max(
                  oMergedStory.lastVisitTime(),oStoredStory.lastVisitTime()));
                lStories.splice(j,1);
                if (!oMergedStory.featuredImage() || oMergedStory.featuredImage() === "") {
                  oMergedStory.setFeaturedImage(oStoredStory.featuredImage());
                }
                j--;
            }
          }
          lStories.push(oMergedStory);
        }

        for (var i = 0, dHistoryItem; dHistoryItem = e.data['lHistoryItems'][i]; i++) {
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

          // Add stories in IndexedDB, and update corresponding historyItems.
          if (lStories.length == 0) {
            // Stop the installation.
            self.installIsFinished();
          } else {
          Cotton.DB.Stories.addStories(self._oDatabase, lStories.reverse(),
            function(oDatabase, _lStories) {
              // Purge lStories.
              var iLength = lStories.length;
              for (var i = 0; i < iLength; i++) {
                lStories[i] = null;
              }
              lStories = [];
              _lStories = [];
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
  install : function(mCallback){
    var self = this;

    // Disable the button and open the howTo page.
    chrome.browserAction.disable();
    chrome.tabs.create({'url': 'http://www.cottontracks.com/howto.html'});

    DEBUG && console.debug("Controller - install");
    self._oBenchmark = new Benchmark("Installation");

    // Set cohort for analytics.
    Cotton.ANALYTICS.setCohort();

    // FIXME(rmoutard->rkorach) : I think we don't need it anymore.
    // Make sure the background page is keeped opened during installation.
    self.wakeUp();

    self._oTempDatabase = new Cotton.Core.TempDatabase(self._oDatabase);
    self._oTempDatabase.populate(function(lHistoryItems, lVisitItems) {
        DEBUG && console.debug('GetHistory returns: '
          + lHistoryItems.length + ' historyItems and '
          + lVisitItems.length + ' visitItems:');
        Cotton.ANALYTICS.historyItemsInstallCount(lHistoryItems.length);
        Cotton.ANALYTICS.visitItemsInstallCount(lVisitItems.length);
        DEBUG && console.debug(lHistoryItems, lVisitItems);
        // visitItems are already dictionnaries, whereas historyItems are objects
        self.lHistoryItemsDict = [];
        for(var i = 0, oItem; oItem = lHistoryItems[i]; i++) {
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
    this._oBenchmark.end();
    chrome.browserAction.enable();
    this._bStopWakeUp = true;
    this._mCallback();
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
    }
    this.lHistoryItemsDict = [];
  },

});
