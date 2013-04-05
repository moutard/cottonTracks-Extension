'use strict';
Cotton.Algo.Score.DBRecord = {};

/**
 * Score between to dictionnary of bag of words.
 * More the score is important more both bag of words are close.
 * @param {Dictionnary} dBagOfWords1 :
 * @param {Dictionnary} dBagOfWords2 :
 */
Cotton.Algo.Score.DBRecord.BagOfWords = function(dBagOfWords1, dBagOfWords2){
  var fScore = 0;
  for(var sKey1 in dBagOfWords1) {
    fScore += dBagOfWords1[sKey1] * (dBagOfWords2[sKey1] || 0);
  }
  return fScore;
};


/**
 * Score between to dbRecord of historyItem.
 * @param : {Object} dictionnary or json : oHistoryItem1
 * @param : {Object} dictionnary or json : oHistoryItem2
 */
Cotton.Algo.Score.DBRecord.HistoryItem = function(dHistoryItem1, dHistoryItem2) {
  return Cotton.Algo.Score.DBRecord.BagOfWords(
    dHistoryItem1['oExtractedDNA']['dBagOfWords'],
    dHistoryItem2['oExtractedDNA']['dBagOfWords']
    );
};
