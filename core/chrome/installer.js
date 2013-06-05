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
    var lHistoryItemsIds = [];
    var lHistoryItems = [];

    // Add listener called when the worker send message back to the main thread.
    self._wInstallWorker.addEventListener('message', function(e) {
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
            Cotton.DB.Stories.addStories(self._oDatabase, lStories.reverse(),
              function(oDatabase, lStories){
                var d = new Date();
                var _endTime = d.getTime();
                var elapsedTime = (_endTime - self._startTime) / 1000;
                DEBUG && console.debug("time elapsed during installation: "
                  + elapsedTime + "ms");
                chrome.browserAction.enable();
                self._bReadyForMessaging = true;
                self._mIsFinished();
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
  install : function(mCallback){
    var self = this;

    // Disable the button and open the howTo page.
    chrome.browserAction.disable();
    chrome.tabs.create({'url': 'http://www.cottontracks.com/howto.html'});

    DEBUG && console.debug("Controller - install");
    // Set cohort for analytics.
    var date = new Date();
    var month = date.getMonth() + 1;
    // TODO(rmoutard): use a ct-cohort to avoid conflit on local storage.
    localStorage.setItem('cohort', month + "/" + date.getFullYear());
    Cotton.ANALYTICS.setCohort(month + "/" + date.getFullYear());

    // start time to benchmark.
    self._startTime = date.getTime();

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
        for(var i = 0, oItem; oItem = lHistoryItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = self._oDatabase._translatorForObject('historyItems', oItem);
          var dItem = oTranslator.objectToDbRecord(oItem);
          lHistoryItemsDict.push(dItem);
        }
        DEBUG && console.debug(lHistoryItemsDict);
        // TODO(rmoutard): put this callback method later, after all the stories
        // are properly stored.
        self._wInstallWorker.postMessage({
          'historyItems' : lHistoryItemsDict,
          'visitItems' : lVisitItems
        });
    });

  },

  wakeUp : function(){
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

});
