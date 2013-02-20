/**
 * Tools regroup a bunch of methods used in each dbscan, like
 * extracting keywords.
 */
Cotton.Algo.Tools = {};

Cotton.Algo.Tools.Filter = function(lWords){
   // Lower case to compare correctly.
  for ( var i = 0; i < lWords.length; i++) {
    lWords[i] = lWords[i].toLowerCase();
  }
  lWords = _.filter(lWords, function(sWord) {
    return sWord.length > 2;
  });
  return lWords;

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
  var oRegexp = /[\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sTitle.match(oRegexp) || [];

  return Cotton.Algo.Tools.Filter(lMatches);

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
  var oRegexp = /[\_|\-|\/]/g
  var lMatches = sUrlPathname.split(oRegexp) || [];

  return Cotton.Algo.Tools.Filter(lMatches);

};

/**
 * Get the number of common words in the title of two visitItems.
 *
 * @param {Object}
 *          oVisitItem1 : pre_treatment computeExtractedWords is needed
 * @param {Object}
 *          oVisitItem2 : pre_treatment computeExtractedWords is needed
 * @returns {int}
 */
Cotton.Algo.Tools.commonWords = function(oVisitItem1, oVisitItem2) {

    return _.intersection(oVisitItem1['lExtractedWords'],
                          oVisitItem2['lExtractedWords']).length;
};

/**
 * Get the number of common words in the title of two visitItems.
 *
 * @param {Object}
 *          oVisitItem1 : pre_treatment computeExtractedWords is needed
 * @param {Object}
 *          oVisitItem2 : pre_treatment computeExtractedWords is needed
 * @returns {int}
 */
Cotton.Algo.Tools.commonQueryWords = function(oVisitItem1, oVisitItem2) {

    return _.intersection(oVisitItem1['lQueryWords'],
                          oVisitItem2['lQueryWords']).length;
};

