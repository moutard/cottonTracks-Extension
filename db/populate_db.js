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
 * Translate an array of history items into an array of cotton history items.
 * @param {Array.<Dict>} list of chrome historyItem from the chrome API.
 * @return {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.DB.Populate.translateListOfChromeHistoryItems = function(lChromeHistoryItems) {
  var iLength = lChromeHistoryItems.length;
  for (var i=0, dChromeHistoryItem; dChromeHistoryItem = lChromeHistoryItems[i]; i++) {
    var oHistoryItem = new Cotton.Model.HistoryItem();

    //oHistoryItem.initId(i);
    oHistoryItem.initUrl(dChromeHistoryItem['url']);
    oHistoryItem.setTitle(dChromeHistoryItem['title']);
    oHistoryItem.setLastVisitTime(dChromeHistoryItem['lastVisitTime']);
    oHistoryItem.setVisitCount(dChromeHistoryItem['visitCount']);
    // Use the array of lChromeHistoryItems to because we don't need those
    // elements anymore and then we save space.
    lChromeHistoryItems[i] = oHistoryItem;
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
    // The historyItem where we want to find the closest google search page.
    var oCurrentVisitItem = lChromeVisitItems[i];
    var oCurrentHistoryItem = lHistoryItems[oCurrentVisitItem['cottonHistoryItemId']];

    // We begin to search from it's position in the chrome history item.
    var iSearchIndex = i;
    var oTempVisitItem = lChromeVisitItems[iSearchIndex];
    var oTempHistoryItem = lHistoryItems[oTempVisitItem['cottonHistoryItemId']];

    // value by default
    oCurrentHistoryItem.extractedDNA().setClosestGoogleSearchPage(sNonFound);
    //oCurrentHistoryItem.extractedDNA().setQueryWords([]);

    while(oTempVisitItem &&
      Math.abs(oTempVisitItem['visitTime'] - oCurrentVisitItem['visitTime']) < iSliceTime
        ){

        oTempHistoryItem = lHistoryItems[oTempVisitItem['cottonHistoryItemId']];
        if (oTempHistoryItem.oUrl().keywords &&
            _.intersection( Cotton.Algo.Tools.StrongFilter(oTempHistoryItem.oUrl().keywords),
                            oCurrentHistoryItem.extractedDNA().extractedWords()).length > 0 ){
          // we found a page that should be the google closest query page.
          oCurrentHistoryItem.extractedDNA().setClosestGoogleSearchPage(oTempHistoryItem.url());
          // This will change the bag of words.
          oCurrentHistoryItem.extractedDNA().setQueryWords(Cotton.Algo.Tools.StrongFilter(
            oTempHistoryItem.oUrl().keywords));
          break;
        } else {
          // the temp page is not a good google search page.
          // try the newt one.
          iSearchIndex += 1;
          oTempVisitItem = lChromeVisitItems[iSearchIndex];
        }
    }
  }

  return lHistoryItems;
};

/**
 * Compute bag of words for title. If it's a search page, then set queryWords
 * and only if there is no title and no query words use the url.
 * That limits the numbers of error because url parser is prone for error.
 * @param {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.DB.Populate.computeBagOfWordsForHistoryItemsList = function(lHistoryItems){
  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oHistoryItem = lHistoryItems[i];
    // It's a search page use keywords to set query words.
    Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oHistoryItem);
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
Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords = function(lHistoryItems){
  var lHistoryItemsWithBagOfWords = [];
  for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oHistoryItem = lHistoryItems[i];
    if (!_.isEmpty(oHistoryItem.extractedDNA().bagOfWords().get())) {
      lHistoryItemsWithBagOfWords.push(oHistoryItem);
    }
  }
  return lHistoryItemsWithBagOfWords;
};

Cotton.DB.Populate.SuiteForCotton = function(lCottonHistoryItems, lChromeVisitItems) {
  Cotton.DB.Populate.computeClosestGoogleSearchPage(lCottonHistoryItems, lChromeVisitItems);
  return lCottonHistoryItems;
};

/**
 * Populate historyItems with a given store. (faster than the previous)
 *
 * @param :
 *          oDatabase
 * @param :
 *          mCallBackFunction
 */
Cotton.DB.Populate.visitItems = function(oClient, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  var iCount = 0;
  var iLength = 0;
  var glCottonHistoryItems = [];
  var glChromeVisitItems = [];

  // Get chrome historyItems.
  oClient.get({
    text : '', // get all
    startTime : 0, // no start time.
    "maxResults" : Cotton.Config.Parameters.dbscan3.iMaxResult,
  }, function(lChromeHistoryItems) {
    var iInitialNumberOfChromeHistoryItems = lChromeHistoryItems.length;
    DEBUG && console.debug('Number of Chrome HistoryItems: ' + iInitialNumberOfChromeHistoryItems);

    // Remove the tools before looking for visitItems.
    glCottonHistoryItems = Cotton.DB.Populate.preRemoveTools(lChromeHistoryItems);

    // After this we are dealing with cotton model history item.
    glCottonHistoryItems = Cotton.DB.Populate.translateListOfChromeHistoryItems(glCottonHistoryItems);
    glCottonHistoryItems = Cotton.DB.Populate.computeBagOfWordsForHistoryItemsList(glCottonHistoryItems);
    glCottonHistoryItems = Cotton.DB.Populate.removeHistoryItemsWithoutBagOfWords(glCottonHistoryItems);

    iLength = glCottonHistoryItems.length;
    DEBUG && console.debug('Number of Chrome HistoryItems after remove tools: ' + iLength);

    // For each chromeHistory remaining find all the corresponding visitItems.
    for(var i = 0; i < iLength; i++){
      // Attribute an fixed id directly instead of putting in the database
      // and let the database attribute the id.
      // Seems there is a problem with the id 0.
      var oHistoryItem = glCottonHistoryItems[i];
      oHistoryItem.initId(i+1);
      oClient.getVisits({
          'url': oHistoryItem.url()
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
            DEBUG && console.debug('Number of Chrome VisitItems: ' + glChromeVisitItems.length);
            elapsedTime1 =  (new Date().getTime() - startTime1)/1000;
            DEBUG && console.debug('Elapsed time:' + elapsedTime1 + 'seconds');
            // TODO(rmoutard) iInitialNumberOfChromeHistoryItems is only used in
            // integration tests, find a way to remove it from here
            glCottonHistoryItems = Cotton.DB.Populate.SuiteForCotton(
              glCottonHistoryItems, glChromeVisitItems);
            mCallBackFunction(
              glCottonHistoryItems, glChromeVisitItems, iInitialNumberOfChromeHistoryItems);
          }
        }
      );
    }
  });
};


