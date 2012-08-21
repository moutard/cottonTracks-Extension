/**
 * Tools regroup a bunch of methods used in each dbscan, like
 * extracting keywords.
 */
Cotton.Algo.Tools = {};

/**
 * Extract words in a title.
 *
 * @param {string}
 *          sTitle
 * @returns {Array.<string>}
 */
Cotton.Algo.Tools.extractWords = function(sTitle) {
  // We cannot use the \b boundary symbol in the regex because accented
  // characters would not be considered (not art of \w).
  // Include all normal characters, dash, accented characters.
  // TODO(fwouts): Consider other characters such as digits?
  var oRegexp = /[\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sTitle.match(oRegexp) || [];

  // Lower case to compare correctly.
  for ( var i = 0; i < lMatches.length; i++) {
    lMatches[i] = lMatches[i].toLowerCase();
  }
  lMatches = _.filter(lMatches, function(sWord) {
    return sWord.length > 2;
  });
  return lMatches;
};

/**
 * Extract words in an url.
 *
 * @param {string}
 *          sUrl
 * @returns {Array.<string>}
 */
Cotton.Algo.Tools.extractWordsUrl = function(sUrl) {
  // For the moment exactly the same than extractWords. But just in case we
  // will keep two different functions.
  var oRegexp = /[\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sUrl.match(oRegexp) || [];

  // Lower case to compare correctly.
  for ( var i = 0; i < lMatches.length; i++) {
    lMatches[i] = lMatches[i].toLowerCase();
  }
  lMatches = _.filter(lMatches, function(sWord) {
    return sWord.length > 2;
  });
  return lMatches;

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

