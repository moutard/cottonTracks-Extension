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
 *          oVisitItem1
 * @param {Object}
 *          oVisitItem2
 * @returns {int}
 */
Cotton.Algo.Tools.commonWords = function(oVisitItem1, oVisitItem2) {
  var lWords1, lWords2, lCommonWords;

  if (oVisitItem1['sTitle'] === "" && oVisitItem2['sTitle'] === "") {
    return -1;
  }

  if (oVisitItem1['lExtractedWords'] === undefined
      || oVisitItem2['lExtractWords'] === undefined) {
    // this part may be deleted but may be usefull in some case.
    lWords1 = Cotton.Algo.Tools.extractWords(oVisitItem1['sTitle']);
    lWords2 = Cotton.Algo.Tools.extractWords(oVisitItem2['sTitle']);
  } else {
    // already computed in preTreatment
    lWords1 = oVisitItem1['sExtractedWords'];
    lWords2 = oVisitItems2['sExtractedWords'];
  }

  lCommonWords = _.intersection(lWords1, lWords2);
  return lCommonWords.length;
};

