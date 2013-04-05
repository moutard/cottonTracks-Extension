/**
 * Distance
 *
 * This file contains all the distance, that you can use for DBSCAN algorithm.
 */
Cotton.Algo.Distance = {};

/**
 * Get the number of common extracted words in the title of two historyItems.
 *
 * @param {Object}
 *          oHistoryItem1 : pre_treatment computeExtractedWords is needed
 * @param {Object}
 *          oHistoryItem2 : pre_treatment computeExtractedWords is needed
 * @returns {int}
 */
Cotton.Algo.Distance.commonExtractedWords = function(oHistoryItem1, oHistoryItem2) {

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
Cotton.Algo.Distance.commonQueryWords = function(oHistoryItem1, oHistoryItem2) {

    return _.intersection(oHistoryItem1['oExtractedDNA']['lQueryWords'],
                          oHistoryItem2['oExtractedDNA']['lQueryWords']).length;
};

/**
 * Compute the distance between the id.
 *
 * @param {Object}
 *          oHistoryItem1
 * @param {Object}
 *          oHistoryItem2
 * @returns {int}
 */
Cotton.Algo.Distance.distanceId = function(oHistoryItem1, oHistoryItem2) {
  return Math.abs(parseInt(oHistoryItem1['id']) - parseInt(oHistoryItem2['id']));
};

/**
 * Compute the distance between the last visitTime.
 *
 * @param {Object}
 *          oHistoryItem1
 * @param {Object}
 *          oHistoryItem2
 * @returns {float}
 */
Cotton.Algo.Distance.distanceVisitTime = function(oHistoryItem1, oHistoryItem2) {
  return Math.abs(oHistoryItem1['iLastVisitTime'] - oHistoryItem2['iLastVisitTime']);
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
 * @param : {Object} dictionnary or json: oHistoryItem1
 * @param : {Object} dictionnayr or json : oHistoryItem2
 */
Cotton.Algo.Distance.onExtractedWords = function(oHistoryItem1, oHistoryItem2) {

  // ExtractedWords
  var iCommonWords = Cotton.Algo.Distance.commonExtractedWords(oHistoryItem1, oHistoryItem2);

  // A is the max possible common words between two historyItems.
  var iMaxCommonWords = Math.min(oHistoryItem1['oExtractedDNA']['lExtractedWords'].length,
    oHistoryItem2['oExtractedDNA']['lExtractedWords'].length);

  // TODO(rmoutard) : is this happens often ? if not remove.
  iMaxCommonWords = Math.max(1, iMaxCommonWords);
  return 1 - (iCommonWords / iMaxCommonWords);

};

/**
 * Compute a distance with extracted query words. In the range [0 - 1].
 *  - 0 all the possible words are common.
 *  - 1 if they are all different.
 *
 * @param : {Object} dictionnary or json : oHistoryItem1
 * @param : {Object} dictionnary or json : oHistoryItem2
 */
Cotton.Algo.Distance.onQueryWords = function(oHistoryItem1, oHistoryItem2) {

  // QueryWords

  var iCommonQueryWords = Cotton.Algo.Distance.commonQueryWords(oHistoryItem1,
      oHistoryItem2);

  var iMaxCommonQueryWords = Math.max(1, Math.min(oHistoryItem1['oExtractedDNA']['lQueryWords'].length,
    oHistoryItem2['oExtractedDNA']['lQueryWords'].length));


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
 * @param : {Object} dictionnary or json : oHistoryItem1
 * @param : {Object} dictionnary or json : oHistoryItem2
 */
Cotton.Algo.Distance.meaning = function(oHistoryItem1, oHistoryItem2){
  var iCoeff = 0.5;
  return iCoeff * Cotton.Algo.Distance.onQueryWords(oHistoryItem1, oHistoryItem2) +
    (1 - iCoeff) * Cotton.Algo.Distance.onExtractedWords(oHistoryItem1, oHistoryItem2);
};

/**
 * Compute a distance between a historyItem and a storyItem
 *
 * @param : {Object} dictionnary or json : oHistoryItem
 * @param : {Object} dictionnary or json : oStoryItem
 */
Cotton.Algo.Distance.fromStory = function(oHistoryItem, oStoryItem){
  var lUnionWords = _.union(oHistoryItem['oExtractedDNA']['lQueryWords'],
      oHistoryItem['oExtractedDNA']['lExtractedWords']);

  var iCommonWords = _.intersection(lUnionWords , oStoryItem['lTags']).length;
  var iMaxCommonWords = Math.max(1, Math.min(lUnionWords.length,
    oStoryItem['lTags'].length));

  return 1 - (iCommonWords / iMaxCommonWords);

};

/**
 * Metrics are distance that respect the 4 conditions of the metrics.
 */
Cotton.Algo.Metrics = {};

/**
 * Return the cosine metrics of 2 bags of words seen as a vector.
 * FIXME(rmoutard) : problem with the dimension of the vector.
 * @param {Dictionnary} dBagOfWords1 :
 * @param {Dictionnary} dBagOfWords2 :
 */
Cotton.Algo.Metrics.DotProduct = function(dBagOfWords1, dBagOfWords2){
  var lCommonDimension = _.intersection(_.keys(dBagOfWords1), _.keys(dBagOfWords2));
  var fDotProduct = 0;
  for (var i = 0, iLength = lCommonDimension.length; i < iLength; i++) {
    var sDimension = lCommonDimension[i];
    fCosine += dBagOfWords1[sDimension] * dBagOfWords2[sDimension];
  }
  return fDotProduct;
};

/**
 * Return the cosine metrics of 2 bags of words seen as a vector.
 * cosine(u,v) = norm(u - v) = sqrt(dotProduct(u-v, u-v))
 * FIXME(rmoutard) : problem with the dimension of the vector.
 * @param {Dictionnary} dBagOfWords1 :
 * @param {Dictionnary} dBagOfWords2 :
 */
Cotton.Algo.Metrics.Cosine = function(dBagOfWords1, dBagOfWords2){
  var dSubstraction = {};
  for(var sKey1 in dBagOfWords1) {
    dSubstraction[sKey1] = dBagOfWords1[sKey1] - (dBagOfWords2[sKey1] || 0);
  }
  for(var sKey2 in dBagOfWords2) {
    dSubstraction[sKey2] = dBagOfWords2[sKey2] - (dBagOfWords1[sKey2] || 0);
  }

  var fCosine = 0;
  for (var sKey in dSubstraction) {
    fCosine += dSubstraction[sKey] * dSubstraction[sKey];
  }
  return fCosine;
};
