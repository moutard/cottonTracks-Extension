'use strict';

/**
 * Becarfull we know that all the elemnts in the pool are the last of there category
 * so it's more like visitItems that historyItems. So we can use the old version.
 */
Cotton.Algo.findClosestGoogleSearchPage = function(lHistoryItemsFromPool) {
  var lHistoryItems = lHistoryItemsFromPool;
  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page

  var sNonFound = "http://www.google.fr/";

  var iLength = lHistoryItems.length;
  for ( var i = 0; i < iLength; i++) {
    // The historyItem where we want to find the closest google search page.
    var oCurrentHistoryItem = lHistoryItems[i];

    // We begin to search from it's position in the chrome history item.
    var iSearchIndex = i;
    var oTempHistoryItem = lHistoryItems[iSearchIndex];

    // value by default
    oCurrentHistoryItem['oExtractedDNA']['sClosestGoogleSearchPage']=sNonFound;

    while(oTempHistoryItem &&
      Math.abs(oTempHistoryItem['iLastVisitTime'] - oCurrentHistoryItem['iLastVisitTime']) < iSliceTime
        ){

        var lKeywords = new UrlParser(oTempHistoryItem['sUrl']).keywords;
        if (lKeywords &&
            _.intersection(lKeywords,
              _.keys(oCurrentHistoryItem['oExtractedDNA']['dBagOfWords'])).length > 0 ){
          // we found a page that should be the google closest query page.
          oCurrentHistoryItem['oExtractedDNA']['sClosestGoogleSearchPage']=oTempHistoryItem['sUrl'];
          // This will change the bag of words.
          var jLength = lKeywords.length;
          for (var j = 0; j < jLength; j++) {
            var sWord = lKeywords[j];
            oCurrentHistoryItem['oExtractedDNA']['dBagOfWords'][sWord] =
              (oCurrentHistoryItem['oExtractedDNA']['dBagOfWords'][sWord] || 0) + 5;
          }
          break;
        } else {
          // the temp page is not a good google search page.
          // try the newt one.
          // in the pool older page are first.
          iSearchIndex -= 1;
          oTempHistoryItem = lHistoryItems[iSearchIndex];
        }
    }
  }

  return lHistoryItems;
};

Cotton.Algo.findClosestSearchPage = function(oHistoryItem, oSearchCache) {
  var lSearchElements = oSearchCache.get();
  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page

  var sNonFound = "http://www.google.fr/";

  // We begin to search from the end of the search cache.
  var iSearchIndex = lSearchElements.length - 1
  var dTempSearchItem = lSearchElements[iSearchIndex];

  // value by default
  oHistoryItem.extractedDNA().setClosestGoogleSearchPage(sNonFound);

  while (dTempSearchItem &&
    Math.abs(oHistoryItem.lastVisitTime() - dTempSearchItem['iLastVisitTime']) < iSliceTime){

      var lKeywords = new UrlParser(dTempSearchItem['sUrl']).keywords;
      if (lKeywords &&
          _.intersection(lKeywords,
            _.keys(oHistoryItem.extractedDNA().bagOfWords().get())).length > 0 ){
        // we found a page that should be the google closest query page.
        oHistoryItem.extractedDNA().setClosestGoogleSearchPage(dTempSearchItem['sUrl']);
        // This will change the bag of words.
        oHistoryItem.extractedDNA().setQueryWords(lKeywords);

        // Use method to compute in one step strong and weak query words.
        var dQueryWords = Cotton.Algo.Tools.QueryWords(lKeywords);
        oHistoryItem.extractedDNA().setStrongQueryWords(dQueryWords["strong"]);
        oHistoryItem.extractedDNA().setWeakQueryWords(dQueryWords["weak"]);

        break;
      } else {
        // the temp page is not a good google search page.
        // try the newt one.
        // in the pool older page are first.
        iSearchIndex --;
        dTempSearchItem = lSearchElements[iSearchIndex];
      }
  }

  return oHistoryItem;
};

