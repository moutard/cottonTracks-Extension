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
   * the database. So it Contains 'visitItems' and 'stories'.
   */
  _oDatabase : null,

  /**
   * Worker to make the algo part in different thread.
   */
  _wDBSCAN3 : null,
  _wDBSCAN2 : null,

  _iTriggerItemId : null,
  _sImageSrc : null,

  /**
   * @constructor
   */
  init : function(){
    var self = this;

    chrome.browserAction.disable();
    self.initWorkerDBSCAN3();
    //self.initWorkerDBSCAN2();

    /**
     * Initialize the store.
     */
    self._oStore = new Cotton.DB.StoreIndexedDB('ct', {

        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
      }, function() {

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
	   * - create_visit_item
	   * - import_history
	   * - pass background image to world
	   */
	  switch (request['action']) {

	  /**
	   * Send by a content_script, each time a new tab is open or
	   * parser has updated informations.
	   *
	   * Available params :
	   * request['params']['visitItem']
	   */
	  case 'create_visit_item':

	    /**
	     * Because Model are compiled in two different way by google closure
	     * compiler we need a common structure to communicate throught messaging.
	     * We use dbRecord, and translators give us a simple serialisation process.
	     */
	    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
	    var oTranslator = lTranslators[lTranslators.length - 1];
	    var oVisitItem = oTranslator.dbRecordToObject(
	                                                request['params']['visitItem']
	                                                  );
	    DEBUG && console.debug("Messaging - create_visit_item");
	    DEBUG && console.debug(oVisitItem.url());

	    // TODO(rmoutard) : use DB system, or a singleton.
	    var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

	    var sPutId = ""; // put return the auto-incremented id in the database.

	    // Put the visitItem only if it's not a Tool, and it's not in the exluded
	    // urls.
	    // TODO (rmoutard) : parseUrl is called twice. avoid that.
	    if (!oExcludeContainer.isExcluded(oVisitItem.url())) {
	      var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
	        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
	      }, function() {
		    //check if url is already in a visitItem in base
			oDatabase.find('visitItems', 'sUrl', oVisitItem.url(), function(oExistingVisitItem){
			  if (oExistingVisitItem){
				//already a visitItem with this url in base
				//send the item to content script
				//TODO(rkorach) : check if there is already paragraphs,
				//and if they have changed with the current page.
				//If so, it should create a new item
				DEBUG && console.debug("visitItem existing, with id " + oExistingVisitItem.id());
				var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
			    var oTranslator = lTranslators[lTranslators.length - 1];
			    var dDbRecord = oTranslator.objectToDbRecord(oExistingVisitItem);
				sendResponse({
                    'received' : "true",
                    'existing' : "true",
                    'visitItem' : dDbRecord,
                    'id' : oExistingVisitItem.id()
                });
			  } else {
				//no visitItem with this url in base
				//create new item
	            // you want to create it for the first time.
	            oDatabase.put('visitItems', oVisitItem, function(iId) {
	              DEBUG && console.debug("visitItem added" + iId);
	              sPutId = iId;
	              var _iId = iId;
	              _.each(oVisitItem.searchKeywords(), function(sKeyword){
	                // PROBLEM if not find.
	                oDatabase.find('searchKeywords', 'sKeyword', sKeyword, function(oSearchKeyword){
	                  if(!oSearchKeyword) {
	                    oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
	                  }

	                  oSearchKeyword.addReferringVisitItemId(_iId);

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
	          .debug("Content Script Listener - This visit item is a tool or an exluded url.");
	    }

	    // to allow sendResponse
	    //return true;
	    break;

	  case 'update_visit_item':
	    /**
	     * Because Model are compiled in two different way by google closure
	     * compiler we need a common structure to communicate throught messaging.
	     * We use dbRecord, and translators give us a simple serialisation process.
	     */
	    var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
	    var oTranslator = lTranslators[lTranslators.length - 1];
	    var oVisitItem = oTranslator.dbRecordToObject(
	                                                request['params']['visitItem']
	                                                  );
	    DEBUG && console.debug("Messaging - update_visit_item");
	    DEBUG && console.debug(oVisitItem.url());
	    // TODO(rmoutard) : use DB system, or a singleton.
	    var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

	    var sPutId = ""; // put return the auto-incremented id in the database.

	    // Put the visitItem only if it's not a Tool, and it's not in the exluded
	    // urls.
	    // TODO (rmoutard) : parseUrl is called twice. avoid that.
	    if (!oExcludeContainer.isExcluded(oVisitItem.url())) {
	      var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
	        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
	      }, function() {
	        // The visit item already exists, just update it.
	        oDatabase.put('visitItems', oVisitItem, function(iId) {
	          DEBUG && console.debug("Messaging - visitItem updated" + iId);
              if (request['params']['contentSet'] === true){
                sendResponse({"updated":"true"})
                DEBUG && console.debug("updated response sent");
              }
	        });
	      });
	    } else {
	      DEBUG && console
	          .debug("Content Script Listener - This visit item is a tool or an exluded url.");
	    }
	    break;

	  /**
	   *
	   */
	  case 'import_history':
	     var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
	         'stories' : Cotton.Translators.STORY_TRANSLATORS,
	         'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,

	       }, function() {
	          // Purge the database before importing new elements.
	          oDatabase.purge('visitItems', function(){
	            oDatabase.purge('stories', function(){

	              // Populate the DB using history Items stored in the file.
	              Cotton.DB.Populate.visitItemsFromFile(oDatabase, request['params']['history']['lHistoryItems'],
	                  function(oDatabase) {
	                    oDatabase.getList('visitItems', function(lAllVisitItems) {
	                      DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
	                          + lAllVisitItems.length + ' items');
	                      console.debug(lAllVisitItems);
	                      var lAllVisitDict = [];
	                      for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
	                        // maybe a setFormatVersion problem
	                        var oTranslator = this._translatorForObject('visitItems', oItem);
	                        var dItem = oTranslator.objectToDbRecord(oItem);
	                        lAllVisitDict.push(dItem);
	                      }
	                      DEBUG && console.debug(lAllVisitDict);

	                      // Define the worker.
	                      var wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

	                      wDBSCAN3.addEventListener('message', function(e) {
	                        DEBUG && console.debug("DBSCAN 3 - MESSAGE");
	                        DEBUG && console.debug(e);

	                        // Update the visitItems with extractedWords and queryWords.
	                        for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
	                          // Data sent by the worker are serialized. Deserialize using translator.
	                          var oTranslator = oDatabase._translatorForDbRecord('visitItems',
	                                                                        e.data['lVisitItems'][i]);
	                          var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


	                          oDatabase.put('visitItems', oVisitItem, function() {
	                            DEBUG && console.debug("update queryKeywords");
	                          });
	                        }

	                        var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
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
   * Initialize the worker in charge of DBSCAN3, and link it to 'message'
   * listener.
   */
  initWorkerDBSCAN3 : function(){
    var self = this;
    self._wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

    self._wDBSCAN3.addEventListener('message', function(e) {

      // Is called when a message is sent by the worker.
      // Use local storage, to see that's it's not the first visit.
      DEBUG && console.debug('wDBSCAN3 - Worker ends with ',
        e.data['iNbCluster'], 'clusters.', ' For ',
        e.data['lVisitItems'].length, ' visitItems');

      // Update the visitItems with extractedWords and queryWords.
      for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
        // Data sent by the worker are serialized. Deserialize using translator.
        var oTranslator = self._oDatabase._translatorForDbRecord('visitItems',
          e.data['lVisitItems'][i]);
        var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


        self._oDatabase.put('visitItems', oVisitItem, function() {
          // pass
        });
      }

      var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                              e.data['iNbCluster']);

      // Add stories
      Cotton.DB.Stories.addStories(self._oDatabase, dStories['stories'],
          function(oDatabase, lStories){

            // pass because don't need to show stories in the world.
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

    Cotton.DB.Populate.visitItems(self._oDatabase, function(oDatabase) {
      oDatabase.getList('visitItems', function(lAllVisitItems) {
        DEBUG && console.debug('FirstInstallation - Start wDBSCAN with '
            + lAllVisitItems.length + ' items');
        DEBUG && console.debug(lAllVisitItems);
        var lAllVisitDict = [];
        for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
          // maybe a setFormatVersion problem
          var oTranslator = this._translatorForObject('visitItems', oItem);
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

