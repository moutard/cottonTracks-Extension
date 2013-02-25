'use strict';

/**
 * Content Script Listener
 *
 * Instance host by background.html Listen all the messages send by content
 * scripts (i.e. scritps injected directly in the page.
 *
 * See below page for more informations.
 * http://code.google.com/chrome/extensions/messaging.html
 */

/**
 * onRequest : link with the chrome API method
 * chrome.extension.onRequest.addListener
 *
 * Called when a message is passed by a content script.
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
                sendResponse({
                  'received' : "true",
                  'id' : sPutId,
                });
              });
            });
          });


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
                            console.log("update queryKeywords");
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
  default:
    break;
  }

  return true;
});
