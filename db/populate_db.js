'use strict';

/**
 * PopulateDB
 *
 * A group of method used during the installation to populate historyItem DB from
 * chrome history historyItem database.
 */

Cotton.DB.Populate = {};

/**
 * PreRemoveTools
 *
 * @param: list of serialized historyItems. (see chrome api for more informations)
 *         remove historyItems that are https, or that are tools.
 */
Cotton.DB.Populate.preRemoveTools = function(lChromeHistoryItems) {
  DEBUG && console.debug('New PreRemoveTools - Start');

  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lChromeHistoryItems, function(dChromeHistoryItem) {
    return (oExcludeContainer.isExcluded(dChromeHistoryItem['url']));
  });
};

/**
 * Translate historyItem from chrome, to cotton history items.
 */
Cotton.DB.Populate.translateChromeHistoryItem = function(dChromeHistoryItem) {
  // distinction between oIDBHistoryItem and oChromeHistoryItem
  var oIDBHistoryItem = new Cotton.Model.HistoryItem();

  oIDBHistoryItem.initUrl(dChromeHistoryItem['url']);
  oIDBHistoryItem.setTitle(dChromeHistoryItem['title']);
  oIDBHistoryItem.setLastVisitTime(dChromeHistoryItem['lastVisitTime']);
  var lExtractedWords = Cotton.Algo.Tools.extractWordsFromTitle(
      dChromeHistoryItem['title']).concat(
        Cotton.Algo.Tools.extractWordsFromUrlPathname(
          oIDBHistoryItem.oUrl().pathname
        )
      );
  // Compute the bag of words using title and url pathname.
  oIDBHistoryItem.extractedDNA().setExtractedWords(lExtractedWords);

  // TODO(rmoutard): complete the bag of words with google closest search to find querywords.
  return oIDBHistoryItem;
};

/**
 * Translate an array of history items into an array of cotton history items.
 */
Cotton.DB.Populate.translateListOfChromeHistoryItems = function(lChromeHistoryItems) {
  var iLength = lChromeHistoryItems.length;
  for (var i=0, oChromeHistoryItem; oChromeHistoryItem = lChromeHistoryItems[i]; i++) {
    lChromeHistoryItems[i] = Cotton.DB.Populate.translateChromeHistoryItem(oChromeHistoryItem);
  }
  return lChromeHistoryItems;
};
/**
 * Tag each historyItem is lHistoryItems with the closest google search. Only if
 * there are some common words, between query keywords and title or url.
 *
 * @param {Array.<Cotton.Model.HistoryItems>} lHistoryItems
 * @returns
 */

Cotton.DB.Populate.computeClosestGoogleSearchPage = function(lHistoryItems) {

  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page

  var sNonFound = "http://www.google.fr/";

  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oCurrentPage = lHistoryItems[i];
    var iSearchIndex = i;
    var oTempPage = lHistoryItems[iSearchIndex];

    // value by default
    oCurrentPage.extractedDNA().setClosestGoogleSearchPage(sNonFound);
    oCurrentPage.extractedDNA().setQueryWords([]);

    while(oTempPage &&
      Math.abs(oCurrentPage.lastVisitTime() - oTempPage.lastVisitTime()) < iSliceTime
        ){
        if (oTempPage.oUrl().keywords &&
            _.intersection( oTempPage.oUrl().keywords,
                            oCurrentPage.extractedDNA().extractedWords()).length > 0 ){
          // we found a page that should be the google closest query page.
          oCurrentPage.extractedDNA().setClosestGoogleSearchPage(oTempPage.url());
          // This will change the bag of words.
          oCurrentPage.extractedDNA().setQueryWords(oTempPage.oUrl().keywords);
          break;
        } else {
          // the temp page is not a good google search page.
          // try the newt one.
          iSearchIndex += 1;
          oTempPage = lHistoryItems[iSearchIndex];
        }
    }
  }

  return lHistoryItems;
};

Cotton.DB.Populate.Suite = function(lChromeHistoryItems) {
    lChromeHistoryItems = Cotton.DB.Populate.preRemoveTools(lChromeHistoryItems);
    var lHistoryItems = Cotton.DB.Populate.translateListOfChromeHistoryItems(lChromeHistoryItems);
    lHistoryItems = Cotton.DB.Populate.computeClosestGoogleSearchPage(lHistoryItems);
    return lHistoryItems;
};
/**
 * Populate historyItems with a given store. (faster than the previous)
 *
 * @param :
 *          oDatabase
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.historyItems = function(oHistoryClient, oDatabase, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  oHistoryClient.get({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lChromeHistoryItems) {

    // Getting elements od chrome history items.
    DEBUG && console.debug('PopulateHistoryItems - chrome history search has returned '
        + lChromeHistoryItems.length + ' items');
    // Call all the pretreatment, to transforme them in historyItem.
    var lHistoryItems = Cotton.DB.Populate.Suite(lChromeHistoryItems);
    DEBUG && console.debug('PopulateHistoryItems - after preRemoveTools left : '
        + lHistoryItems.length + ' items');

    // Populate the database.
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
      // distinction between oIDBHistoryItem and oChromeHistoryItem
      oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId) {
        iCount += 1;
        if (iCount === iPopulationLength) {
          elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
          DEBUG && console.debug('PopulateDB end with time : ' + elapsedTime1 + 's');
          mCallBackFunction(oDatabase);
        }
      });
    }
  });
};

/**
 * Populate historyItems with a given store. (faster than the previous)
 *
 * @param :
 *          oDatabase
 * @param :
 *          mCallBackFunction
 */
Cotton.DB.Populate.visitItems = function(oDatabase, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lChromeHistoryItems) {
    console.log(lChromeHistoryItems.length)
    var processVisits = function(dChromeHistoryItem, lChromeVisitItems){
      for(var j = 0, dChromeVisitItem; dChromeVisitItem = lChromeVisitItems[j]; j++){
        dChromeVisitItem['url'] = dChromeHistoryItem['url'];
        dChromeVisitItem['title'] = dChromeHistoryItem['title'];
        // Detect session need iLastVisitTime.
        dChromeVisitItem['iLastVisitTime'] = dChromeVisitItem['visitTime'];
        lVisitItems.push(dChromeVisitItem);
      }
      iCount += 1;
      if(iCount === iLength){
      lVisitItems.sort(function(a, b){
        return b['iLastVisitTime'] - a['iLastVisitTime'];
      });
      mCallBackFunction(lVisitItems);
      }
    };

    var processVisitsWithUrl = function(dChromeHistoryItem) {
      // We need the url of the visited item to process the visit.
      // Use a closure to bind the  url into the callback's args.
      return function(visitItems) {
        processVisits(dChromeHistoryItem, visitItems);
      };
    };

    var iCount = 0;
    var lVisitItems = [];
    lChromeHistoryItems = Cotton.DB.Populate.preRemoveTools(lChromeHistoryItems);
    var iLength = lChromeHistoryItems.length;
    console.log(lChromeHistoryItems.length);
    for(var i = 0, dChromeHistoryItem; dChromeHistoryItem = lChromeHistoryItems[i]; i++){
      chrome.history.getVisits({
        'url':dChromeHistoryItem['url']
      }, processVisitsWithUrl(dChromeHistoryItem));
    }
  });
};


