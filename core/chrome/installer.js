'use strict';

Cotton.Core.Installer = Class.extend({

  _oDatabase : null,

  /**
   * call back method called when the installation is finished.
   */
  _mIsFinished : null,

  /**
   * Worker to make the algo part in different thread.
   */
  _wInstallWorker : null,

  init: function(oDatabase, mCallback){
    var self = this;
    self._oDatabase = oDatabase;
    self._mIsFinished = mCallback;

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
        var bMerged = false;
        for (var i = 0, oNewStory; oNewStory = lNewStories[i]; i++) {
          // Find among all the stories we already have one that could be merged with.
          for (var j = 0, oStoredStory; oStoredStory = lStories[j]; j++) {
            // TODO(rkorach) : do not use _.intersection
            if (_.intersection(oNewStory.historyItemsId(),
                  oStoredStory.historyItemsId()).length > 0) {
                bMerged = true;
                // there is an item in two different stories or they have the same words
                // in the title
                oStoredStory.setHistoryItemsId(_.union(
                  oStoredStory.historyItemsId(), oNewStory.historyItemsId()));
                oStoredStory.setLastVisitTime(Math.max(
                  oStoredStory.lastVisitTime(), oNewStory.lastVisitTime()));

                if (!oStoredStory.featuredImage()
                    || oStoredStory.featuredImage() === "") {
                  oStoredStory.setFeaturedImage(oNewStory.featuredImage());
                }
            }
            break;
          }
          if (!bMerged) { lStories.push(oNewStory); }
        }

        if (iTotalSessions && iSessionCount === iTotalSessions) {
          // add items in indexedDB, then stories. We need to wait for the historyItems
          // FIXME(rmoutard): be sure that they are all in the base.
          // to be in base because when putting the stories we update iStoryId in the base
            // Add stories in IndexedDB.
            if(lStories.length == 0) {
              // Stop the installation.
              self.installIsFinished();
            } else {
            Cotton.DB.Stories.addStories(self._oDatabase, lStories.reverse(),
              function(oDatabase, lStories) {
                self.installIsFinished();
              });
          }
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

    Cotton.Core.Populate.visitItems(self._oDatabase,
      function(lHistoryItems, lVisitItems) {
        DEBUG && console.debug('GetHistory returns: '
          + lHistoryItems.length + ' historyItems and '
          + lVisitItems.length + ' visitItems:');
        Cotton.ANALYTICS.historyItemsInstallCount(lHistoryItems.length);
        Cotton.ANALYTICS.visitItemsInstallCount(lVisitItems.length);
        DEBUG && console.debug(lHistoryItems, lVisitItems);
        // visitItems are already dictionnaries, whereas historyItems are objects
        var lHistoryItemsDict = [];
        for(var i = 0, oItem; oItem = lHistoryItems[i]; i++) {
          // maybe a setFormatVersion problem
          var oTranslator = self._oDatabase._translatorForObject('historyItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lHistoryItemsDict.push(dItem);
        }
        DEBUG && console.debug(lHistoryItemsDict);
        self._wInstallWorker.postMessage({
          'historyItems' : lHistoryItemsDict,
          'visitItems' : lVisitItems
        });
    });

  },

  wakeUp : function() {
    var self = this;
    /*
     * HACK
     */
    // as long as the install and population of the database is not finished
    // we regularly call the background page to keep it awake
    chrome.runtime.getBackgroundPage(function(oPage){});
    if (!this._bReadyForMessaging){
      DEBUG && console.debug('wake up!');
      setTimeout(function(){
        self.wakeUp();
      }, 5000);
    }
  },

  installIsFinished : function() {
    var self = this;
    self._oBenchmark.end();
    chrome.browserAction.enable();
    self._bReadyForMessaging = true;
    self._mIsFinished();
  }

});
