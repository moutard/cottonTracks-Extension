'use strict';

/**
 * Pretreatment are launch only once to compute all that will be necessary and
 * frequently used.
 *
 * Notes : PreTreatment is used in the worker, so all data received are
 * serialized. That's why, lHistoryItem is a list of Object (dictionary). And not
 * a list of Cotton.Model.HistoryItem.
 */
Cotton.Algo.PreTreatment = {};

/**
 * For each oHistoryItem in lHistoryItems, compute parseUrl.
 * Notes : an array is a primitive type so passed by value.
 *
 * @param lHistoryItems
 * @returns
 */
Cotton.Algo.PreTreatment.computeParseUrl = function(lHistoryItems) {
  // Instead of computing every time you compute a distance

  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oUrl = new UrlParser(lHistoryItems[i]['sUrl']);
    // assign oUrl.
    lHistoryItems[i]['oUrl'] = oUrl;
    lHistoryItems[i]['sPathname'] = oUrl.pathname;
    lHistoryItems[i]['sHostname'] = oUrl.hostname;
  }
  return lHistoryItems;
};

/**
 * For each oHistoryItem in lHistoryItems, extract words of the title.
 *
 * @param lHistoryItems
 * allow in worker.
 * @returns
 */
Cotton.Algo.PreTreatment.computeExtractedWords = function(lHistoryItems) {
  // Instead of computing every time you compute a distance

  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    lHistoryItems[i]['oExtractedDNA']['lExtractedWords'] = [].concat(
        Cotton.Algo.Tools.extractWordsFromTitle(lHistoryItems[i]['sTitle']),
        Cotton.Algo.Tools.extractWordsFromUrlPathname(lHistoryItems[i]['oUrl']['pathname'])
        );
  }
  return lHistoryItems;
};

/**
 * For each oHistoryItem in lHistoryItems, compute the bag of words.
 *
 * @param lHistoryItems
 * Allow in worker.
 * @returns
 */
Cotton.Algo.PreTreatment.computeBagOfWords = function(lHistoryItems) {
  // Instead of computing every time you compute a distance
  // we know that words are lower case by using functions computeExtractedWords
  // that used the filters function.
  var iLength = lHistoryItems.length;
  for ( var i = 0; i < iLength; i++) {
    var dBagOfWords = {};
    var lExtractedWords = lHistoryItems[i]['oExtractedDNA']['lExtractedWords'];
    var lQueryWords = lHistoryItems[i]['oExtractedDNA']['lQueryWords'];
    for(var j = 0, sWord; sWord = lExtractedWords[j]; j++) {
      dBagOfWords[sWord] = dBagOfWords[sWord] || 0;
      dBagOfWords[sWord] += Cotton.Config.Parameters.scoreForExtractedWords;
    }
    for(var k = 0, sWord; sWord = lQueryWords[k]; k++) {
      dBagOfWords[sWord] = dBagOfWords[sWord] || 0;
      dBagOfWords[sWord] += Cotton.Config.Parameters.scoreForQueryWords;
    }

    lHistoryItems[i]['oExtractedDNA']['dBagOfWords'] = dBagOfWords;
  }
  return lHistoryItems;
};


/**
 * Tag each historyItem is lHistoryItems with the closest google search. Only if
 * there are some common words, between query keywords and title or url.
 *
 * @param lHistoryItems
 * @returns
 */
Cotton.Algo.PreTreatment.computeClosestGoogleSearchPage = function(lHistoryItems) {

  var iSliceTime = Cotton.Config.Parameters.iSliceTime;
  // After this time a page is considered as non-linked with a query search page

  var sNonFound = "http://www.google.fr/";

  for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
    var oCurrentPage = lHistoryItems[i];
    var iSearchIndex = i;
    var oTempPage = lHistoryItems[iSearchIndex];

    // value by default
    oCurrentPage['oExtractedDNA']['sClosestGoogleSearchPage'] = sNonFound;
    oCurrentPage['oExtractedDNA']['lQueryWords'] = [];

    while(oTempPage &&
        Math.abs(oCurrentPage['iLastVisitTime'] - oTempPage['iLastVisitTime']) < iSliceTime
        ){
        if (oTempPage['oUrl']['keywords'] &&
            _.intersection( oTempPage['oUrl']['keywords'],
                            oCurrentPage['oExtractedDNA']['lExtractedWords']).length > 0 ){
          // we found a page that should be the google closest query page.
          oCurrentPage['oExtractedDNA']['sClosestGoogleSearchPage'] = oTempPage['sUrl'];
          oCurrentPage['oExtractedDNA']['lQueryWords'] = oTempPage['oUrl']['keywords'];
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

/**
 * Apply all the pretreatment to lHistoryItems.
 * Note: array is a primitive type so it's passed by value.
 * @param {Array.
 *          <Object>} lHistoryItems
 * @returns {Array.<Object>}
 */
Cotton.Algo.PreTreatment.suite = function(lHistoryItems) {
  // The order is important!
  lHistoryItems = Cotton.Algo.PreTreatment.computeParseUrl(lHistoryItems);
  lHistoryItems = Cotton.Algo.PreTreatment.computeExtractedWords(lHistoryItems);
  lHistoryItems = Cotton.Algo.PreTreatment
      .computeClosestGoogleSearchPage(lHistoryItems);
  lHistoryItems = Cotton.Algo.PreTreatment
      .computeBagOfWords(lHistoryItems);

  return lHistoryItems;
};
