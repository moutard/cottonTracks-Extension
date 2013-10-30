'use strict';

Cotton.Algo.Tools = {};

Cotton.Algo.Tools.LooseCondition = function(sWord) {
  var sTempWord = sWord.toLowerCase();
  return sTempWord.length > 2 && (!Cotton.Algo.Common.Words.isInBlackList(sTempWord));
};

Cotton.Algo.Tools.TightCondition = function(sWord) {
  var sTempWord = sWord.toLowerCase();
  var allow_onlyletters = new RegExp("^[a-zA-Zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]{3,}$");
  return allow_onlyletters.test(sTempWord)
      && (! Cotton.Algo.Common.Words.isInBlackList(sTempWord));
};

/**
 * Given a list of words keep only those that do match the following
 * conditions:
 * - unique
 * - length > 2 char
 * - is not in the black list.
 */
Cotton.Algo.Tools.LooseFilter = function(lWords) {
  // Lower case to compare correctly.
  var iLength = lWords.length;
  for ( var i = 0; i < iLength; i++) {
    lWords[i] = lWords[i].toLowerCase();
  }
  var lWordsFiltered = [];
  var iLength = lWords.length;
  for ( var i = 0; i < iLength; i++) {
    var sWord = lWords[i];
    if (sWord.length > 2 && (!Cotton.Algo.Common.Words.isInBlackList(sWord))) {
      lWordsFiltered.push(sWord);
    }
  }
  return lWordsFiltered;
};

/**
 * Given a list of words keep only those that do match the following
 * conditions:
 * - unique
 * - length > 2 char
 * - is not in the black list.
 * - there is only letter in the word.
 */
Cotton.Algo.Tools.TightFilter = function(lWords) {
  // Lower case to compare correctly.
  var iLength = lWords.length;
  for ( var i = 0; i < iLength; i++) {
    lWords[i] = lWords[i].toLowerCase();
  }

  // Authorize only letters in words. (no special characters and numbers.)
  // and words need length > 2.
  var allow_onlyletters = new RegExp("^[a-zA-Zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]{3,}$");
  var lWordsFiltered = [];
  var iLength = lWords.length;
  for ( var i = 0; i < iLength; i++) {
    var sWord = lWords[i];
    if(allow_onlyletters.test(sWord)
      && (! Cotton.Algo.Common.Words.isInBlackList(sWord))) {
      lWordsFiltered.push(sWord);
      }
  }

  return lWordsFiltered;

};

/**
 * Return the list of queryWords strong and weak.
 */
Cotton.Algo.Tools.QueryWords = function(lQueryWords) {
  var lWeakQueryWords = [];
  var lStrongQueryWords = [];
  // We use the LooseCondition for the query word.
  // Reminder we use TightCondition only for words extracted from an url.
  var iLength = lQueryWords.length;
  for (var i = 0; i < iLength; i++) {
    var sTempWord = lQueryWords[i].toLowerCase();
    if (sTempWord.length > 2
        && (!Cotton.Algo.Common.Words.isInBlackList(sTempWord))) {
        lStrongQueryWords.push(sTempWord);
    } else {
      lWeakQueryWords.push(sTempWord);
    }
  }
  return {
    "weak": lWeakQueryWords,
    "strong": lStrongQueryWords
  };
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
  // Detail of the Regexp: every longest (+) chain of character that is not (^)
  // with any of ([]) the special characters listed.
  var oRegexp = /[^\ |\-|\||\_|\"|\'|\xAB|\xBB|\.|\,|\;|\:|\?|\!|\(|\)|\\|\/]+/g;

  return sTitle.match(oRegexp) || [];
};

Cotton.Algo.Tools.extractCleanWordsFromTitle = function(sTitle) {
  var sWhiteListTitle = Cotton.Algo.Common.Words.removeFromTitle(sTitle);
  var lWords = Cotton.Algo.Tools.extractWordsFromTitle(sWhiteListTitle);
  return Cotton.Algo.Tools.TightFilter(lWords);
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
  var oRegexp = /\_|\-|\/|\%20|\ |\;|\.|asp$|php$|html$|htm$|jpg$|png$|jpeg$|pdf$|gif$/ig;
  var lMatches = sUrlPathname.split(oRegexp) || [];

  return Cotton.Algo.Tools.TightFilter(lMatches);

};

/**
 * Compute bag of words for title. If it's a search page, then set queryWords
 * and only if there is no title and no query words use the url.
 * That limits the numbers of error because url parser is prone for error.
 * @param {Array.<Cotton.Model.HistoryItem>}
 */
Cotton.Algo.Tools.computeBagOfWordsForHistoryItem = function(oHistoryItem) {
    // It's a search page use keywords to set query words.
    var lQueryWords = oHistoryItem.oUrl().keywords;
    if (lQueryWords) {
      oHistoryItem.extractedDNA().addListQueryWords(oHistoryItem.oUrl().keywords);

      // Use method to compute in one step strong and weak query words.
      var dQueryWords = Cotton.Algo.Tools.QueryWords(lQueryWords);
      oHistoryItem.extractedDNA().setStrongQueryWords(dQueryWords["strong"]);
      oHistoryItem.extractedDNA().setWeakQueryWords(dQueryWords["weak"]);

    } else {
      // google image result, whose title is the url of the image
      if (oHistoryItem.oUrl().searchImage) {
        var oImageUrl = new UrlParser(oHistoryItem.oUrl().searchImage);
        var lPathname = oImageUrl.pathname.split('/');
        var sImageName = lPathname[lPathname.length-1].split('.')[0];
        var lExtractedWords = Cotton.Algo.Tools.extractWordsFromUrlPathname(sImageName);
      } else {
        // Use title words.
        var lExtractedWords = Cotton.Algo.Tools.extractCleanWordsFromTitle(oHistoryItem.title());
      }
      // If there is no title url, use the url pathname.
      if (lExtractedWords.length === 0) {
        lExtractedWords = Cotton.Algo.Tools.extractWordsFromUrlPathname(oHistoryItem.oUrl().pathname);
      }
      oHistoryItem.extractedDNA().addListToBagOfWords(lExtractedWords);
    }
    return oHistoryItem;
};

