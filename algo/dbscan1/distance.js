/**
 * Distance
 * 
 * This file contains all the distance, that you can use for DBSCAN algorithm.
 */
Cotton.Algo.Distance = {};
Cotton.Algo.Tools = {};

/**
 * Extract words in a title.
 * 
 * @param {string}
 *          sTitle
 * @returns {Boolean}
 */
Cotton.Algo.Tools.extractWords = function(sTitle) {
  // We cannot use the \b boundary symbol in the regex because accented
  // characters would not be considered (not art of \w).
  // Include all normal characters, dash, accented characters.
  // TODO(fwouts): Consider other characters such as digits?
  var oRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sTitle.match(oRegexp) || [];
  // TODO(fwouts): Be nicer on the words we keep, but still reject useless words
  // such as "-".

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

/**
 * Compute the distance between the id.
 * 
 * @param {Object}
 *          oVisitItem1
 * @param {Object}
 *          oVisitItem2
 * @returns {int}
 */
Cotton.Algo.Distance.distanceId = function(oVisitItem1, oVisitItem2) {
  return Math.abs(parseInt(oVisitItem1['id']) - parseInt(oVisitItem2['id']));
};

/**
 * Compute the distance between the last visitTime.
 * 
 * @param {Object}
 *          oVisitItem1
 * @param {Object}
 *          oVisitItem2
 * @returns {float}
 */
Cotton.Algo.Distance.distanceVisitTime = function(oVisitItem1, oVisitItem2) {
  return Math.abs(oVisitItem1['iVisitTime'] - oVisitItem2['iVisitTime']);
};

/**
 * Compute the distance for the given key. Global version, of previous distance.
 * 
 * @param {string}
 *          sKey : the key that will be used to compute distance.
 * @param {Object}
 *          oObject1
 * @param {Object}
 *          oObject2
 * @returns {float}
 */
Cotton.Algo.Distance.distanceKey = function(sKey, oObject1, oObject2) {
  return Math.abs(oObject1.sKey - oObject2.sKey);
};

/**
 * Compute a distance, but only use the meaning. - title - url - queryKeywords
 * 
 * @param {Object}
 *          oVisitItem : need generatedPage computed.
 * @param {Object}
 *          oVisitItem : need generatedPage computed.
 */
Cotton.Algo.Distance.meaning = function(oVisitItem, oVisitItem) {

  var coeff = Cotton.Config.Parameters.distanceCoeff;

  // Common words
  // number of common words is high => items close
  // ordre de grandeur = O(5)
  // close if 0(1) far if 0.
  var iCommonWords = Cotton.Algo.Tools.commonWords(oVisitItem1, oVisitItem2);
  if (iCommonWords === 0) {
    sum += coeff.penalty; // try to detect parallel stories.
  } else if (iCommonWords === -1) {
    // if there is no title do not put the penalty
    // or put low penalty
    sum += coeff.penalty;
  } else {
    sum -= (coeff.commonWords * (1 + iCommonWords)) / 10;
  }

  // Query keywords
  var iCommonQueryKeywords = Cotton.Algo.distanceBetweenGeneratedPages(
      oVisitItem1, oVisitItem2);
  sum += (coeff.queryKeywords / ((1 + iCommonQueryKeywords) * (1 + iCommonQueryKeywords)));

  return sum;
};

/**
 * Compute distance that use every criteria.
 */
Cotton.Algo.distanceComplexe = function(oVisitItem1, oVisitItem2) {
  // TODO(rmoutard) : Write a better distance, maybe to keep it between [0,1]
  // for instance you need to balance common words

  // TODO: (rmoutard) write a class for coefficients
  var coeff = Cotton.Config.Parameters.distanceCoeff;

  // id
  // id close => items close
  // ordre de grandeur = close if 0(1) , far if 0(20).
  var sum = coeff.id
      * Math.abs(parseInt(oVisitItem1['id']) - parseInt(oVisitItem2['id']))
      / 200;

  // lastTimeVisit
  // lastTimeVisit close => items close
  // ordre de grandeur = O(100 000)
  // close if 0(100 000) far if 0(600 000)
  sum += coeff.lastVisitTime
      * Math.abs(oVisitItem1['iVisitTime'] - oVisitItem2['iVisitTime'])
      / 1000000;

  // Common words
  // number of common words is high => items close
  // ordre de grandeur = O(5)
  // close if 0(1) far if 0.
  var iCommonWords = Cotton.Algo.Tools.commonWords(oVisitItem1, oVisitItem2);
  if (iCommonWords === 0) {
    sum += coeff.penalty; // try to detect parallel stories.
  } else if (iCommonWords === -1) {
    // if there is no title do not put the penalty
    // or put low penalty
    sum += coeff.penalty;
  } else {
    sum -= (coeff.commonWords * (1 + iCommonWords)) / 10;
  }

  // Query keywords
  var iCommonQueryKeywords = Cotton.Algo.distanceBetweenGeneratedPages(
      oVisitItem1, oVisitItem2);
  sum += (coeff.queryKeywords / ((1 + iCommonQueryKeywords) * (1 + iCommonQueryKeywords)));

  return sum;
};

/**
 * Compute the distance between two generated pages (search page Google)
 * 
 * @param {Object}
 *          oVisitItem1
 * @param {Object}ÊoVisitItem2
 * @returns {int} number of common queryKeymords.
 */
Cotton.Algo.distanceBetweenGeneratedPages = function(oVisitItem1, oVisitItem2) {

  var keywords1 = oVisitItem1['lQueryKeywords'];
  var keywords2 = oVisitItem2['lQueryKeywords'];

  var result = _.intersection(keywords1, keywords2);
  return result.length;
};