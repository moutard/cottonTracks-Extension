'use strict';

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
  var allow_onlyletters = new RegExp("^[a-zA-Zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]{3,}$");
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
  var oRegexp = /\ |\-|\_|\"|\'|\xAB|\xBB|\.|\,|\;|\:|\?|\!|\(|\)|\\|\//;
  sTitle = Cotton.Algo.Common.Words.removeFromTitle(sTitle);
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
 * Compute bag of words for title. If it's a search page, then set queryWords
 * and only if there is no title and no query words use the url.
 * That limits the numbers of error because url parser is prone for error.
 * @param {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.Algo.Tools.computeBagOfWordsForHistoryItem = function(oHistoryItem){
    // It's a search page use keywords to set query words.
    if(oHistoryItem.oUrl().keywords){
      oHistoryItem.extractedDNA().setQueryWords(oHistoryItem.oUrl().keywords);
    } else {
      // Use title words.
      var lExtractedWords = Cotton.Algo.Tools.extractWordsFromTitle(oHistoryItem.title());
      // If there is no title url, use the url pathname.
      if(lExtractedWords.length === 0){
        lExtractedWords = Cotton.Algo.Tools.extractWordsFromUrlPathname(oHistoryItem.oUrl().pathname);
      }
      oHistoryItem.extractedDNA().setExtractedWords(lExtractedWords);
    }
    return oHistoryItem;
};

