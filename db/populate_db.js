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
  var lResult = [];

  for(var i=0, dChromeHistoryItem; dChromeHistoryItem = lChromeHistoryItems[i]; i++){
    if(!oExcludeContainer.isExcluded(dChromeHistoryItem['url'])){
      lResult.push(dChromeHistoryItem);
    }
  }

  return lResult;
};

/**
 * Translate historyItem from chrome, to cotton history items.
 * @param {Dictionnary} a chrome history item directly from the API.
 * @return {Cotton.Model.HistoryItem}
 */
Cotton.DB.Populate.translateChromeHistoryItem = function(dChromeHistoryItem) {
  var oHistoryItem = new Cotton.Model.HistoryItem();

  oHistoryItem.initId(dChromeHistoryItem['cottonHistoryItemId']);
  oHistoryItem.initUrl(dChromeHistoryItem['url']);
  oHistoryItem.setTitle(dChromeHistoryItem['title']);
  oHistoryItem.setLastVisitTime(dChromeHistoryItem['lastVisitTime']);

  return oHistoryItem;
};

/**
 * Translate an array of history items into an array of cotton history items.
 * @param {Array.<Dict>} list of chrome historyItem from the chrome API.
 * @return {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.DB.Populate.translateListOfChromeHistoryItems = function(lChromeHistoryItems) {
  var iLength = lChromeHistoryItems.length;
  // Use the array of lChromeHistoryItems to because we don't need those
  // elements anymore and then we save space.
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
 * @param {Array.<Dict>} lChromeVisitItems
 * @returns
 */
Cotton.DB.Populate.computeClosestGoogleSearchPage = function(lHistoryItems, lChromeVisitItems) {

  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page

  var sNonFound = "http://www.google.fr/";

  for ( var i = 0, iLength = lChromeVisitItems.length; i < iLength; i++) {
    var oCurrentPage = lHistoryItems[lChromeVisitItems[i]['cottonHistoryItemId']];
    var iSearchIndex = i;
    var oTempPage = lHistoryItems[lChromeVisitItems[iSearchIndex]['cottonHistoryItemId']];

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
          oTempPage = lHistoryItems[lChromeVisitItems[iSearchIndex]['cottonHistoryItemId']];
        }
    }
  }

  return lHistoryItems;
};

Cotton.DB.Populate.computeBagOfWordsForGoogleSearch = function(lHistoryItems){
  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oPage = lHistoryItems[i];
    if(oPage.oUrl().keywords){
      // Problem if an history item comes many times.
      oPage.extractedDNA().setExtractedWords(oPage.oUrl().keywords);
    }
  }
  return lHistoryItems;
};

/**
 * Compute bag of words for title only if there is no word for title.
 * That limits the numbers of error because url parser is prone for error.
 * @param {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.DB.Populate.computeBagOfWordsForTitle = function(lHistoryItems){
  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oPage = lHistoryItems[i];
    oPage.extractedDNA().setExtractedWords(
      Cotton.Algo.Tools.extractWordsFromTitle(oPage.title()));
  }
  return lHistoryItems;
};


/**
 * Compute bag of words for url only if there is no word for title.
 * That limits the numbers of error because url parser is prone for error.
 * @param {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.DB.Populate.computeBagOfWordsForUrl = function(lHistoryItems){
  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oPage =  lHistoryItems[i];
    if (_.isEmpty(oPage.extractedDNA().bagOfWords().get())) {
      oPage.extractedDNA().setExtractedWords(
        Cotton.Algo.Tools.extractWordsFromUrl(oPage.oUrl().pathname));
    }
  }
  return lHistoryItems;
};

/**
 * remove words that appear too often in title of the same hostname.
 * for instance "Alice - Wikipedia, the free encyclopedia"
 * remove "Wikipedia" "free" and "encyclopedia"
 */
Cotton.DB.Populate.removeFrequentExtractedWords = function(lHistoryItems){
  return lHistoryItems;
};

/**
 * Remove history items without bag of words.
 */
Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords = function(lHistoryItems, lChromeVisitItems){
  var lHistoryItemsWithoutBagOfWords = [];
  var lVisitItemsWithoutBagOfWords = [];
  for ( var i = 0, iLength = lChromeVisitItems.length; i < iLength; i++) {
    var oPage = lHistoryItems[lChromeVisitItems[i]['cottonHistoryItemId']];
    if (!_.isEmpty(oPage.extractedDNA().bagOfWords().get())) {
      lHistoryItemsWithoutBagOfWords.push(oPage);
      lVisitItemsWithoutBagOfWords.push(lChromeVisitItems[i]);
    }
  }
  return [lHistoryItemsWithoutBagOfWords, lVisitItemsWithoutBagOfWords];
};

Cotton.DB.Populate.SuiteForCotton = function(lChromeHistoryItems, lChromeVisitItems) {
  var lCottonHistoryItems = Cotton.DB.Populate.translateListOfChromeHistoryItems(lChromeHistoryItems);
  lCottonHistoryItems = Cotton.DB.Populate.computeBagOfWordsForTitle(lCottonHistoryItems);
  lCottonHistoryItems = Cotton.DB.Populate.removeFrequentExtractedWords(lCottonHistoryItems);
  lCottonHistoryItems = Cotton.DB.Populate.computeBagOfWordsForGoogleSearch(
    lCottonHistoryItems, lChromeVisitItems);
  lCottonHistoryItems = Cotton.DB.Populate.computeBagOfWordsForUrl(lCottonHistoryItems);
  var L = Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords(
    lCottonHistoryItems, lChromeVisitItems);
  return [lCottonHistoryItems, lChromeVisitItems];
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
Cotton.DB.Populate.visitItems = function(mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  var iCount = 0;
  var iLength = 0;
  var glChromeHistoryItems = [];
  var glChromeVisitItems = [];

  // Get chrome historyItems.
  chrome.history.search({
    text : '', // get all
    startTime : 0, // no start time.
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lChromeHistoryItems) {
    var iInitialNumberOfChromeHistoryItems = lChromeHistoryItems.length;
    DEBUG && console.log('Number of Chrome HistoryItems: ' + iInitialNumberOfChromeHistoryItems);

    // Remove the tools before looking for visitItems.
    glChromeHistoryItems = Cotton.DB.Populate.preRemoveTools(lChromeHistoryItems);
    iLength = glChromeHistoryItems.length;
    DEBUG && console.log('Number of Chrome HistoryItems after remove tools: ' + iLength);

    // For each chromeHistory remaining find all the corresponding visitItems.
    for(var i = 0; i < iLength; i++){
      // Attribute an fixed id directly instead of putting in the database
      // and let the database attribute the id.
      // Seems there is a problem with the id 0.
      var dChromeHistoryItem = lChromeHistoryItems[i];
      dChromeHistoryItem['sId'] = i;
      chrome.history.getVisits({
          'url':dChromeHistoryItem['url']
        }, function(lVisitItems){
          // assign a temp cottonhistoryid that correspesponds to its position
          // int the glChromeVisitItems
          for( var i = 0; i < lVisitItems.length; i++){
            lVisitItems[i]['cottonHistoryItemId'] = iCount;
          }
          glChromeVisitItems = glChromeVisitItems.concat(lVisitItems);
          iCount +=1;
          if(iCount === iLength){
            glChromeVisitItems.sort(function(a, b){
              return b['visitTime'] - a['visitTime'];
            });
            DEBUG && console.log('Number of Chrome VisitItems: ' + glChromeVisitItems.length);
            elapsedTime1 =  (new Date().getTime() - startTime1)/1000;
            DEBUG && console.log('Elapsed time:' + elapsedTime1 + 'seconds');
            mCallBackFunction(glChromeHistoryItems, glChromeVisitItems,
              iInitialNumberOfChromeHistoryItems);
          }
        }
      );
    }
  });
};


