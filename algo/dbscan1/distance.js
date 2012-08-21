/**
 * Distance
 *
 * This file contains all the distance, that you can use for DBSCAN algorithm.
 */
Cotton.Algo.Distance = {};

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
