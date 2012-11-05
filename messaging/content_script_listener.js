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

  console.log(request);

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
    console.debug(oVisitItem.url());
    // Compute the referer id as it should be returned by the Chrome Extension
    // History API. We need this algorithm because in some cases, such as when
    // you open a link in a new tab, the referer id is not filled by Chrome, so
    // we need to fill it ourselves.
    // TODO(fwouts): Move out of here.

//    var mGetVisitsHandler = function(lChromeReferrerVisitItems) {
      // Select the last one the visit items.

      /*if (lChromeReferrerVisitItems && lChromeReferrerVisitItems.length > 0) {
        var iIndex = lChromeReferrerVisitItems.length - 1;
        var oReferrerVisitItem = lChromeReferrerVisitItems[iIndex];
        // Update the visit item accordingly.
        oVisitItem.setChromeReferringVisitId(oReferrerVisitItem.visitId);
      }*/

      // Other processing following this.

      // TODO(rmoutard) : use DB system, or a singleton.
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the visitItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oVisitItem.url())) {
        var oStore = new Cotton.DB.Store('ct', {
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
          'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
        }, function() {

          // you want to create it for the first time.
          oStore.put('visitItems', oVisitItem, function(iId) {
            console.log("visitItem added");
            console.log(iId);
            sPutId = iId;
            var _iId = iId;
            _.each(oVisitItem.searchKeywords(), function(sKeyword){
              // PROBLEM if not find.
              oStore.find('searchKeywords', 'sKeyword', sKeyword, function(oSearchKeyword){
                if(!oSearchKeyword) {
                  oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
                }

                oSearchKeyword.addReferringVisitItemId(_iId);

                oStore.put('searchKeywords', oSearchKeyword, function(iiId){
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
        console
            .debug("Content Script Listener - This visit item is a tool or an exluded url.");
      }
//    };

    /*
    var sReferringUrl = oVisitItem.referrerUrl();
    if (sReferringUrl) {
      chrome.history.getVisits({
        url : sReferringUrl
      }, mGetVisitsHandler);
    } else {
      mGetVisitsHandler([]);
    }
    */

    // to allow sendResponse
    //return true;

  /**
   * DEPRECATED
   */
  case 'update_visit_item':
    return true;

  /**
   *
   */
  case 'import_history':
     var oStore = new Cotton.DB.Store('ct', {
         'stories' : Cotton.Translators.STORY_TRANSLATORS,
         'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,

       }, function() {
          // Purge the database before importing new elements.
          oStore.purge('visitItems', function(){
            oStore.purge('stories', function(){

              // Populate the DB using history Items stored in the file.
              Cotton.DB.Populate.visitItemsFromFile(oStore, request['params']['history']['lHistoryItems'],
                  function(oStore) {
                    oStore.getList('visitItems', function(lAllVisitItems) {
                      console.debug('FirstInstallation - Start wDBSCAN with '
                          + lAllVisitItems.length + ' items');
                      console.debug(lAllVisitItems);
                      var lAllVisitDict = [];
                      for(var i = 0, oItem; oItem = lAllVisitItems[i]; i++){
                        // maybe a setFormatVersion problem
                        var oTranslator = this._translatorForObject('visitItems', oItem);
                        var dItem = oTranslator.objectToDbRecord(oItem);
                        lAllVisitDict.push(dItem);
                      }
                      console.debug(lAllVisitDict);

                      // Define the worker.
                      var wDBSCAN3 = new Worker('algo/dbscan3/worker_dbscan3.js');

                      wDBSCAN3.addEventListener('message', function(e) {
                        Cotton.Utils.debug("DBSCAN 3 - MESSAGE");
                        Cotton.Utils.debug(e);

                        // Use local storage, to see that's it's not the first visit.
                        console.log('wDBSCAN - Worker ends: ', e.data['iNbCluster']);
                        console.log('wDBSCAN - Worker ends: ', e.data['lVisitItems']);

                        // Update the visitItems with extractedWords and queryWords.
                        for ( var i = 0; i < e.data['lVisitItems'].length; i++) {
                          // Data sent by the worker are serialized. Deserialize using translator.
                          var oTranslator = oStore._translatorForDbRecord('visitItems',
                                                                        e.data['lVisitItems'][i]);
                          var oVisitItem = oTranslator.dbRecordToObject(e.data['lVisitItems'][i]);


                          oStore.put('visitItems', oVisitItem, function() {
                            console.log("update queryKeywords");
                          });
                        }

                        var dStories = Cotton.Algo.clusterStory(e.data['lVisitItems'],
                                                                e.data['iNbCluster']);
                        // Add stories
                        console.log(dStories);
                        Cotton.DB.Stories.addStories(oStore, dStories['stories'],
                            function(oStore){
                        });
                      }, false);


                      wDBSCAN3.postMessage(lAllVisitDict);
                      sendResponse({
                        'received' : "true",
                        'id' : sPutId,
                      });

                    });
                  });

                });
          });
      });
    //return true;

  }

});

chrome.runtime.onInstalled.addListener(function() {

  // Define favorites default values.
  if(!localStorage['ct-favorites_webistes']){
    var lFavorites = [];
    lFavorites.push({
      'id': 0,
      'image' : '/media/images/home/tickets/TC.jpg',
      'name' : 'Techcrunch',
      'url' : 'http://techcrunch.com'
    });
    lFavorites.push({
      'id': 1,
      'image' : '/media/images/home/tickets/Fubiz.jpg',
      'name' : 'Fubiz',
      'url' : 'http://fubiz.net'
    });
    lFavorites.push({
      'id': 2,
      'image' : '/media/images/home/tickets/FB.jpg',
      'name' : 'Facebook',
      'url' : 'http://facebook.com'
    });
    lFavorites.push({
      'id': 3,
      'image' : '/media/images/home/tickets/Dribbble.jpg',
      'name' : 'Dribbble',
      'url' : 'http://dribbble.com'
    });
    //
    lFavorites.push({
      'id': 4,
      'image' : '/media/images/home/tickets/MTV.jpg',
      'name' : 'MTV',
      'url' : 'http://www.mtv.com'
    });
    lFavorites.push({
      'id': 5,
      'image' : '/media/images/home/tickets/PandoDaily.jpg',
      'name' : 'PandoDaily',
      'url' : 'http://pandodaily.com'
    });
    lFavorites.push({
      'id': 6,
      'image' : '/media/images/home/tickets/Twitter.jpg',
      'name' : 'Twitter',
      'url' : 'http://twitter.com'
    });
    lFavorites.push({
      'id': 7,
      'image' : '/media/images/home/tickets/Pinterest.jpg',
      'name' : 'Pinterest',
      'url' : 'http://pinterest.com'
    });

    localStorage['ct-favorites_webistes'] = JSON.stringify(lFavorites);
  }

  // ct-grid_mode
  // Define which grid is seen first "favorites" by default.
  if(!localStorage['ct-grid_mode']){
    localStorage['ct-grid_mode'] = "favorites";
  }
});
