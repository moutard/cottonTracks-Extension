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
      // There is no duplicate in this list.
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
  },

  /**
   * To make it faster we assume that dbRecord1 comes from the database. So it
   * already has an id.
   */
  merged: function(dDBRecord1, dDBRecord2) {

    // We should make something more general that check unique keys constraints
    // are respected, but it comes from longer process and we want this function
    // is really fast as is blocking DB transaction.
    // dDBRecord1['id'] = dDBRecord1['id'] || dDBRecord2['id'];
    var lStories1 = dDBRecord1['lReferringStoriesId'] || [];
    var lStories2 = dDBRecord2['lReferringStoriesId'] || [];
    var lHistoryItems1 = dDBRecord1['lReferringHistoryItemsId'] || [];
    var lHistoryItems2 = dDBRecord2['lReferringHistoryItemsId'] || [];

    for(var i=0; i < lStories2.length; i++) {
      if(lStories1.indexOf(lStories2[i]) === -1) lStories1.push(lStories2[i]);
    }
    if(lStories1.length > 0) { dDBRecord1['lReferringStoriesId'] = lStories1;}

    for(var i=0; i < lHistoryItems2.length; i++) {
      if(lHistoryItems1.indexOf(lHistoryItems2[i]) === -1) lHistoryItems1.push(lHistoryItems2[i]);
    }
    if(lHistoryItems1.length > 0){ dDBRecord1['lReferringHistoryItemsId'] = lHistoryItems1; }

    return dDBRecord1;
  }

});
