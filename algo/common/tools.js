/**
 * Tools regroup a bunch of methods used in each dbscan, like
 * extracting keywords.
 */
Cotton.Algo.Tools = {};

Cotton.Algo.Tools.Filter = function(lWords){
   // Lower case to compare correctly.
  for ( var i = 0, iLength = lWords.length; i < iLength; i++) {
    lWords[i] = lWords[i].toLowerCase();
  }
  lWords = _.filter(lWords, function(sWord) {
    return sWord.length > 2 && (!Cotton.Algo.Common.Words.isInBlackList(sWord));
  });
  return lWords;

};

Cotton.Algo.Tools.StrongFilter = function(lWords){
   // Lower case to compare correctly.
  for ( var i = 0, iLength = lWords.length; i < iLength; i++) {
    lWords[i] = lWords[i].toLowerCase();
  }

  // Authorize only letters in words. (no special characters and numbers.)
  // and words need length > 2.
  var allow_onlyletters = new RegExp("^[a-zA-Z]{3,}$");
  var lWordsFiltered = [];
  for ( var i = 0, iLength = lWords.length; i < iLength; i++) {
    var sWord = lWords[i];
    if(allow_onlyletters.test(sWord)
      && (! Cotton.Algo.Common.Words.isInBlackList(sWord))){
      lWordsFiltered.push(sWord);
      }
  }

  return lWordsFiltered;

};


/**
 * Extract words in a title.
 *
 * @param {string}
 *          sTitle
 * @returns {Array.<string>}
 */
Cotton.Algo.Tools.extractWordsFromTitle = function(sTitle) {
  // We cannot use the \b boundary symbol in the regex because accented
  // characters would not be considered (not art of \w).
  // Include all normal characters, dash, accented characters.
  // TODO(fwouts): Consider other characters such as digits?
  //var oRegexp = /[\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var oRegexp = /\ |\-|\_|\"|\'|\xAB|\xBB|\.|\,|\;|\?|\!|\(|\)|\\|\//;
  var lMatches = sTitle.split(oRegexp) || [];

  return Cotton.Algo.Tools.StrongFilter(lMatches);

};

/**
 * Extract words in an url pathname (ie only the end of the url there is
 * often the title of the article in it).
 *
 * @param {string}
 *          sUrl
 * @returns {Array.<string>}
 */
Cotton.Algo.Tools.extractWordsFromUrlPathname = function(sUrlPathname) {
  var oRegexp = /\_|\-|\/|\%20|\;|\./
  //var oRegexp = new RegExp("\_|\-|\/|\%20|\;|\.");
  var lMatches = sUrlPathname.split(oRegexp) || [];

  return Cotton.Algo.Tools.StrongFilter(lMatches);

};

/**
 * Extract words in an url pathname (ie only the end of the url there is
 * often the title of the article in it).
 *
 * @param {string}
 *          sUrl
 * @returns {Array.<string>}
 */
Cotton.Algo.Tools.extractWordsFromUrl = function(sUrl) {
  var oUrl = new UrlParser(sUrl);
  oUrl.fineDecomposition();
  var oRegexp = /[\_|\-|\/|\%20]/g
  var lMatches = oUrl.pathname.split(oRegexp) || [];

  var lWords = Cotton.Algo.Tools.StrongFilter(lMatches);

  return lWords;

};

/**
 * Extract words in an historyItem
 * Compute words for title, remove repeated words and if there is no words
 * at the end use the url.
 *
 * @param {Cotton.Model.HistoryItem} oHistoryItem
 */
Cotton.Algo.Tools.extractWordsFromHistoryItem = function(oHistoryItem) {
  var lWordsFromTitle = Cotton.Algo.Tools.extractWordsFromTitle(oHistoryItem.title());
  var lWords = [];

  // If there is the name of the service in the title remove it.
  // example : wikipedia for www.wikipedia.fr
  var sService = oHistoryItem.oUrl().service;
  for(var i=0, iLength=lWordsFromTitle.length; i < iLength; i++ ) {
    if(lWordsFromTitle[i]!==sService) {
      lWords.push(lWordsFromTitle[i]);
    }
  }
  if(lWords.length === 0){
    lWords = Cotton.Algo.Tools.extractWordsFromUrl(oHistoryItem.url());
  }
  return lWords;

};


/**
 * Get the number of common extracted words in the title of two historyItems.
 *
 * @param {Object}
 *          oHistoryItem1 : pre_treatment computeExtractedWords is needed
 * @param {Object}
 *          oHistoryItem2 : pre_treatment computeExtractedWords is needed
 * @returns {int}
 */
Cotton.Algo.Tools.commonExtractedWords = function(oHistoryItem1, oHistoryItem2) {

    return _.intersection(oHistoryItem1['oExtractedDNA']['lExtractedWords'],
                          oHistoryItem2['oExtractedDNA']['lExtractedWords']).length;
};

/**
 * Get the number of common words in the title of two historyItems.
 *
 * @param {Object}
 *          oHistoryItem1 : pre_treatment computeExtractedWords is needed
 * @param {Object}
 *          oHistoryItem2 : pre_treatment computeExtractedWords is needed
 * @returns {int}
 */
Cotton.Algo.Tools.commonQueryWords = function(oHistoryItem1, oHistoryItem2) {

    return _.intersection(oHistoryItem1['oExtractedDNA']['lQueryWords'],
                          oHistoryItem2['oExtractedDNA']['lQueryWords']).length;
};

