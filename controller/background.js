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

  _sImageSrc : null,

  /**
   * MessagingController
   */
  _oMessagingController : null,

 /**
   * MessagingController
   */
  _oContentScriptListener : null,

  /**
   * @constructor
   */
  init : function(){
    var self = this;

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
        self._oContentScriptListener = new Cotton.Controllers.ContentScriptListener(self._oMessagingController);

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
        if (tab.url.slice(0,7) !== "http://"
            && tab.url.slice(0,19) !=="https://www.google."){
	    //TODO(rkorach) use regex
          chrome.browserAction.disable(tabId);
        } else {
          chrome.browserAction.enable(tabId);
        }
    });

    chrome.browserAction.onClicked.addListener(function() {
      self.takeScreenshot();
      // chrome.tabs.getSelected is now deprecated. chrome.tabs.query is used instead
      chrome.tabs.query({'active':true, 'currentWindow': true}, function(lTabs){
        chrome.tabs.update(lTabs[0].id, {'url':'lightyear.html'},function(){
	      // TODO(rkorach) : delete ct page from history
	    });
	  });
    });
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
			if (request.image == "background"){
				sendResponse({src: self._sImageSrc});
			}
    });

	/**
	 * Content Script Listener
	 * Called when a message is passed by a content script.
	 * http://code.google.com/chrome/extensions/messaging.html
	 */

	// Listen for the content script to send a message to the background page.
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	  DEBUG && console.debug(request);

	  /**
	   * DISPACHER
	   * All the message send by sendMessage arrived here.
	   * CottonTracks defined an "action" parameters.
	   * - create_history_item
	   * - import_history
	   * - pass background image to world
	   */
	  switch (request['action']) {

	  /**
	   * Send by a content_script, each time a new tab is open or
	   * parser has updated informations.
	   *
	   * Available params :
	   * request['params']['historyItem']
	   */
	  case 'create_history_item':

	    /**
	     * Because Model are compiled in two different way by google closure
	     * compiler we need a common structure to communicate throught messaging.
	     * We use dbRecord, and translators give us a simple serialisation process.
	     */
	    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
	    var oTranslator = lTranslators[lTranslators.length - 1];
	    var oHistoryItem = oTranslator.dbRecordToObject(
	                                                request['params']['historyItem']
	                                                  );
	    DEBUG && console.debug("Messaging - create_history_item");
	    DEBUG && console.debug(oHistoryItem.url());

	    // TODO(rmoutard) : use DB system, or a singleton.
	    var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

	    var sPutId = ""; // put return the auto-incremented id in the database.

	    // Put the historyItem only if it's not a Tool, and it's not in the exluded
	    // urls.
	    // TODO (rmoutard) : parseUrl is called twice. avoid that.
	    if (!oExcludeContainer.isExcluded(oHistoryItem.url())) {
	      var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
	        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
	      }, function() {
		    //check if url is already in a historyItem in base
			oDatabase.find('historyItems', 'sUrl', oHistoryItem.url(), function(oExistingHistoryItem){
			  if (oExistingHistoryItem){
				//already a historyItem with this url in base
				//send the item to content script
				//TODO(rkorach) : check if there is already paragraphs,
				//and if they have changed with the current page.
				//If so, it should create a new item
				DEBUG && console.debug("historyItem existing, with id " + oExistingHistoryItem.id());
				var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
			    var oTranslator = lTranslators[lTranslators.length - 1];
			    var dDbRecord = oTranslator.objectToDbRecord(oExistingHistoryItem);
				sendResponse({
                    'received' : "true",
                    'existing' : "true",
                    'historyItem' : dDbRecord,
                    'id' : oExistingHistoryItem.id()
                });
			  } else {
				//no historyItem with this url in base
				//create new item
	            // you want to create it for the first time.
	            oDatabase.put('historyItems', oHistoryItem, function(iId) {
	              DEBUG && console.debug("historyItem added" + iId);
	              sPutId = iId;
	              var _iId = iId;
	              _.each(oHistoryItem.searchKeywords(), function(sKeyword){
	                // PROBLEM if not find.
	                oDatabase.find('searchKeywords', 'sKeyword', sKeyword, function(oSearchKeyword){
	                  if(!oSearchKeyword) {
	                    oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
	                  }

	                  oSearchKeyword.addReferringHistoryItemId(_iId);

	                  oDatabase.put('searchKeywords', oSearchKeyword, function(iiId){
	                    // Return nothing to let the connection be cleaned up.
	                  });
	                });
	              });
                  sendResponse({
                    'received' : "true",
                    'id' : sPutId,
                  });
                });
              }
            });
	      });
	    } else {
	      DEBUG && console
	          .debug("Content Script Listener - This history item is a tool or an exluded url.");
	    }

	    // to allow sendResponse
	    //return true;
	    break;

	  case 'update_history_item':
	    /**
	     * Because Model are compiled in two different way by google closure
	     * compiler we need a common structure to communicate throught messaging.
	     * We use dbRecord, and translators give us a simple serialisation process.
	     */
	    var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
	    var oTranslator = lTranslators[lTranslators.length - 1];
	    var oHistoryItem = oTranslator.dbRecordToObject(
	                                                request['params']['historyItem']
	                                                  );
	    DEBUG && console.debug("Messaging - update_history_item");
	    DEBUG && console.debug(oHistoryItem.url());
	    // TODO(rmoutard) : use DB system, or a singleton.
	    var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

	    var sPutId = ""; // put return the auto-incremented id in the database.

	    // Put the historyItem only if it's not a Tool, and it's not in the exluded
	    // urls.
	    // TODO (rmoutard) : parseUrl is called twice. avoid that.
	    if (!oExcludeContainer.isExcluded(oHistoryItem.url())) {
	      var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
	        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
	      }, function() {
	        // The history item already exists, just update it.
	        oDatabase.put('historyItems', oHistoryItem, function(iId) {
	          DEBUG && console.debug("Messaging - historyItem updated" + iId);
              if (request['params']['contentSet'] === true){
                sendResponse({"updated":"true"})
                DEBUG && console.debug("updated response sent");
              }
	        });
	      });
	    } else {
	      DEBUG && console
	          .debug("Content Script Listener - This history item is a tool or an exluded url.");
	    }
	    break;

	  /**
	   *
	   */
	  case 'import_history':
	     var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	         'stories' : Cotton.Translators.STORY_TRANSLATORS,
	         'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,

	       }, function() {
	          // Purge the database before importing new elements.
	          oDatabase.purge('historyItems', function(){
	            oDatabase.purge('stories', function(){

	              // Populate the DB using history Items stored in the file.
	              Cotton.DB.Populate.historyItemsFromFile(oDatabase, request['params']['history']['lHistoryItems'],
	                  function(oDatabase) {
	                    oDatabase.getList('historyItems', function(lAllHistoryItems) {
	                      DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
	                          + lAllHistoryItems.length + ' items');
	                      console.debug(lAllHistoryItems);
	                      var lAllVisitDict = [];
	                      for(var i = 0, oItem; oItem = lAllHistoryItems[i]; i++){
	                        // maybe a setFormatVersion problem
	                        var oTranslator = this._translatorForObject('historyItems', oItem);
	                        var dItem = oTranslator.objectToDbRecord(oItem);
	                        lAllVisitDict.push(dItem);
	                      }
	                      DEBUG && console.debug(lAllVisitDict);

	                      // Define the worker.
	                      var wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

	                      wDBSCAN3.addEventListener('message', function(e) {
	                        DEBUG && console.debug("DBSCAN 3 - MESSAGE");
	                        DEBUG && console.debug(e);

	                        // Update the historyItems with extractedWords and queryWords.
	                        for ( var i = 0; i < e.data['lHistoryItems'].length; i++) {
	                          // Data sent by the worker are serialized. Deserialize using translator.
	                          var oTranslator = oDatabase._translatorForDbRecord('historyItems',
	                                                                        e.data['lHistoryItems'][i]);
	                          var oHistoryItem = oTranslator.dbRecordToObject(e.data['lHistoryItems'][i]);


	                          oDatabase.put('historyItems', oHistoryItem, function() {
	                            DEBUG && console.debug("update queryKeywords");
	                          });
	                        }

	                        var dStories = Cotton.Algo.clusterStory(e.data['lHistoryItems'],
	                                                                e.data['iNbCluster']);
	                        // Add stories
	                        DEBUG && console.debug(dStories);
	                        Cotton.DB.Stories.addStories(oDatabase, dStories['stories'],
	                            function(oDatabase){
	                        });
	                      }, false);


	                      wDBSCAN3.postMessage(lAllVisitDict);
	                      //sendResponse({
	                      //  'received' : "true",
	                      //  'id' : sPutId,
	                      //});

	                    });
	                  });

	                });
	          });
	      });
	    //return true;
	    break;
      /**
       *  pass the screenshot taken before upadting the page to lightyear
       */
	  case 'pass_background_image':
        sendResponse({src: self._sImageSrc});
	    break;
	  default:
	    break;
	  }

	  return true;
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
      lHistoryItemToKeep = [];
      _.each(e.data['lHistoryItems'], function(dVisiItem){
        if(dHistoryItem['clusterId'] !== "UNCLASSIFIED"
          && dHistoryItem['clusterId'] !== "NOISE"){
            delete dHistoryItem['clusterId'];
            lHistoryItemToKeep.push(dHistoryItem);
        }
      });
      self._oPool.refresh(lHistoryItemToKeep);

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
      for ( var i = 0; i < e.data['lHistoryItems'].length; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oDatabase._translatorForDbRecord('historyItems',
          e.data['lHistoryItems'][i]);
        var oHistoryItem = oTranslator.dbRecordToObject(e.data['lHistoryItems'][i]);

        self._oDatabase.put('historyItems', oHistoryItem, function() {
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

	takeScreenshot: function(){
		self = this
			chrome.tabs.captureVisibleTab(function(img) {
			  self._sImageSrc = img;
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
});

chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
  Cotton.ONEVENT = oInstallationDetails['reason'];
});

Cotton.BACKGROUND = new Cotton.Controllers.Background();

