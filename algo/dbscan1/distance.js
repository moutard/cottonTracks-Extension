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
  return Math.abs(oObject1[sKey] - oObject2[sKey]);
};

/**
 * Compute a distance with extracted words. In the range [0 - 1].
 *  - 0 all the possible words are common.
 *  - 1 if they are all different.
 *
 * @param : {Object} dictionnary or json: oVisitItem1
 * @param : {Object} dictionnayr or json : oVisitItem2
 */
Cotton.Algo.Distance.commonExtractedWords = function(oVisitItem1, oVisitItem2) {

  // ExtractedWords
  var iCommonWords = Cotton.Algo.Tools.commonExtractedWords(oVisitItem1, oVisitItem2);

  // A is the max possible common words between two visit items.
  var iMaxCommonWords = Math.min(oVisitItem1['lExtractedWords'].length,
    oVisitItem2['lExtractedWords'].length);

  // TODO(rmoutard) : is this happens often ? if not remove.
  iMaxCommonWords = Math.max(1, iMaxCommonWords);
  return 1 - (iCommonWords / iMaxCommonWords);

};

/**
 * Compute a distance with extracted query words. In the range [0 - 1].
 *  - 0 all the possible words are common.
 *  - 1 if they are all different.
 *
 * @param : {Object} dictionnary or json : oVisitItem1
 * @param : {Object} dictionnary or json : oVisitItem2
 */
Cotton.Algo.Distance.commonQueryWords = function(oVisitItem1, oVisitItem2) {

  // QueryWords

  var iCommonQueryWords = Cotton.Algo.Tools.commonQueryWords(oVisitItem1,
      oVisitItem2);

  var iMaxCommonQueryWords = Math.max(1, Math.min(oVisitItem1['lQueryWords'].length,
    oVisitItem2['lQueryWords'].length));

  return 1 - (iCommonQueryWords / iMaxCommonQueryWords);

};

/**
 * Compute a distance with :
 *  - extracted words
 *  - query words.
 *
 *  In the range [0 - 1].
 *   - 0 is good
 *   - 1 is bad
 *
 * @param : {Object} dictionnary or json : oVisitItem1
 * @param : {Object} dictionnary or json : oVisitItem2
 */
Cotton.Algo.Distance.meaning = function(oVisitItem1, oVisitItem2){
  var iCoeff = 0.5;
  return iCoeff * Cotton.Algo.Distance.commonQueryWords(oVisitItem1, oVisitItem2) +
    (1 - iCoeff) * Cotton.Algo.Distance.commonExtractedWords(oVisitItem1, oVisitItem2);
};

/**
 * Compute a distance between a visitItem and a storyItem
 *
 * @param : {Object} dictionnary or json : oVisitItem
 * @param : {Object} dictionnary or json : oStoryItem
 */
Cotton.Algo.Distance.fromStory = function(oVisitItem, oStoryItem){
  var lUnionWords = _.union(oVisitItem['lQueryWords'],
      oVisitItem['lExtractedWords']);

  var iCommonWords = _.intersection(lUnionWords , oStoryItem['lTags']).length;
  var iMaxCommonWords = Math.max(1, Math.min(lUnionWords.length,
    oStoryItem['lTags'].length));

  return 1 - (iCommonWords / iMaxCommonWords);

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
  var iCommonWords = Cotton.Algo.Tools.commonExtractedWords(oVisitItem1, oVisitItem2);
  if (iCommonWords === 0) {
    // Try to detect parallel stories.
    sum += coeff.penalty;
  } else if (iCommonWords === -1) {
    sum += coeff.penalty;
  } else {
    sum -= (coeff.commonWords * (1 + iCommonWords)) / 10;
  }

  // Query keywords
  var iCommonQueryKeywords = Cotton.Algo.Tools.commonQueryWords(oVisitItem1,
      oVisitItem2);
  sum += (coeff.queryKeywords / ((1 + iCommonQueryKeywords) * (1 + iCommonQueryKeywords)));

  return sum;
};

/**
 * Metrics are distance that respect the 4 conditions of the metrics.
 */
Cotton.Algo.Metrics = {};

/**
 * Return the cosine metrics of 2 bags of words seen as a vector.
 * FIXME(rmoutard) : problem with the dimension of the vector.
 * @param {Dictionnary} lBagOfWords1 :
 * @param {Dictionnary} lBagOfWords2 :
 */
Cotton.Algo.Metrics.Cosine = function(lBagOfWords1, lBagOfWords2){
  var lCommonDimension = _.intersection(_.keys(lBagOfWords1), _.keys(lBagOfWords2));
  var fCosine = 0;
  _.each(lCommonDimension, function(sDimension){
    fCosine += lBagOfWords1[sDimension] * lBagOfWords2[sDimension];
  });
  return fCosine;
};



