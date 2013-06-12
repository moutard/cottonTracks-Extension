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

Cotton.Algo.Tools.strongQueryWords = function(lQueryWords){
  return Cotton.Algo.Tools.Filter(lQueryWords);
};

Cotton.Algo.Tools.weakQueryWords = function(lQueryWords){
  var lWeakQueryWords = [];
  var lStrongQueryWords = Cotton.Algo.Tools.strongQueryWords(lQueryWords);
  for (var i = 0, sQueryWord; sQueryWord = lQueryWords[i]; i++){
    if (lStrongQueryWords.indexOf(sQueryWord) === -1){
      lWeakQueryWords.push(sQueryWord);
    }
  }
  return lWeakQueryWords;
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
  var oRegexp = /\_|\-|\/|\%20|\;|\.|asp$|php$|html$|htm$|jpg$|png$|jpeg$|pdf$|gif$/ig;
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
    var lQueryWords = oHistoryItem.oUrl().keywords;
    if(lQueryWords){
      oHistoryItem.extractedDNA().addListQueryWords(oHistoryItem.oUrl().keywords);
      oHistoryItem.extractedDNA().setStrongQueryWords(
        Cotton.Algo.Tools.strongQueryWords(lQueryWords));
      oHistoryItem.extractedDNA().setWeakQueryWords(
        Cotton.Algo.Tools.weakQueryWords(lQueryWords));
    } else {
      // google image result, whose title is the url of the image
      if (oHistoryItem.oUrl().searchImage) {
        var oImageUrl = new UrlParser(oHistoryItem.oUrl().searchImage);
        var lPathname = oImageUrl.pathname.split('/');
        var sImageName = lPathname[lPathname.length-1].split('.')[0];
        var lExtractedWords = Cotton.Algo.Tools.extractWordsFromUrlPathname(sImageName);
      } else {
        // Use title words.
        var lExtractedWords = Cotton.Algo.Tools.extractWordsFromTitle(oHistoryItem.title());
      }
      // If there is no title url, use the url pathname.
      if(lExtractedWords.length === 0){
        lExtractedWords = Cotton.Algo.Tools.extractWordsFromUrlPathname(oHistoryItem.oUrl().pathname);
      }
      oHistoryItem.extractedDNA().addExtractedWordsToBagOfWords(lExtractedWords);
    }
    return oHistoryItem;
};

