'use strict';
Cotton.Algo.Score.Object = {};

/**
 * Score between a historyItem and a Story.
 * @param {Cotton.Model.HistoryItem} oHistoryItem
 * @param {Cotton.Model.HistoryItem} oStory
 */
Cotton.Algo.Score.Object.historyItemToStory = function(oHistoryItem, oStory){
  return Cotton.Algo.Score.DBRecord.BagOfWords(
      oHistoryItem.extractedDNA().bagOfWords().get(),
      oStory.dna().bagOfWords().get());
};
