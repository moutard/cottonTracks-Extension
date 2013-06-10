'use strict';

/**
 * Search Keyword
 */
var dSearchKeywordIndexes = {
  // optional id is indexed automatically.
  'id' : {
    'unique' : true
  },
  'sKeyword' : {
    'unique' : true
  },
};

Cotton.Model.SearchKeyword = Cotton.DB.Model.extend({

  _sModelStore: 'searchKeywords',
  _dModelIndexes: dSearchKeywordIndexes,
  _default: function(){
    return {
      'id': undefined,
      'sKeyword': undefined,
      'lReferringHistoryItemsId':[], // list of historyItems that contains this word.
      'lReferringStoriesId':[], // list of stories that contains this word.
      /**
       * {Integer} _iFrequencyInCorpus :
       * Number of times word appears in all pages. Allow to compute idf (inverse
       * document frequency). More the words appears less it is important:
       *  - because it can be a stop words (verbs like be, go, and conjugaison)
       *  - imagine all the corpus talk about javascript, then javascript becomes
       *  less important to classified, we want something smaller.
       */
      'iFrequencyInCorpus': 0
    };
  },

  id : function() {
    return this.get('id');
  },

  initId : function(iId) {
    if(this.get('id') === undefined){
      this.set('id', iId);
    }
  },

  keyword : function() {
    return this.get('sKeyword');
  },

  referringHistoryItemsId : function() {
    return this.get('lReferringHistoryItemsId');
  },

  setReferringHistoryItemsId : function(lHistoryItemsId) {
    this.set('lReferringHistoryItemsId', lHistoryItemsId);
  },

  addReferringHistoryItemId : function(iHistoryItemId) {
    var lTemp = this.get('lReferringHistoryItemsId');
    if(_.indexOf(lTemp, iHistoryItemId) === -1){
      lTemp.push(iHistoryItemId);
      this.set('lReferringHistoryItemsId', lTemp);
    }
  },

  referringStoriesId : function() {
    return this.get('lReferringStoriesId');
  },

  setReferringStoriesId : function(lStoriesId) {
    this.set('lReferringStoriesId', lStoriesId);
  },

  addReferringStoryId : function(iStoryId) {
    var lTemp = this.get('lReferringStoriesId');
    if(_.indexOf(lTemp, iStoryId) === -1){
      lTemp.push(iStoryId);
      this.set('lReferringStoriesId', lTemp);
    }
  },

  frequency : function() {
    return this.get('iFrequencyInCorpus');
  },

  setFrequency : function(iFrequency) {
    this.set('iFrequencyInCorpus', iFrequency);
  }

});
