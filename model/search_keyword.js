'use strict';

/**
 * Search Keyword
 */
Cotton.Model.SearchKeyword = Class.extend({

  _iId : undefined,
  _sKeyword : undefined,
  _lReferringHistoryItemsId : null,   // list of historyItems that contains this word.
  _lReferringStoriesId : null,          // list of stories that contains this word.

  /**
   * {Integer} _iFrequencyInCorpus :
   * Number of times word appears in all pages. Allow to compute idf (inverse
   * document frequency). More the words appears less it is important:
   *  - because it can be a stop words (verbs like be, go, and conjugaison)
   *  - imagine all the corpus talk about javascript, then javascript becomes
   *  less important to classified, we want something smaller.
   */
  _iFrequencyInCorpus : undefined,

  /**
   * 
   */
  init : function(sKeyword) {
    this._sKeyword = sKeyword;

    this._lReferringHistoryItemsId = [];
    this._lReferringStoriesId = [];

    this._iFrequencyInCorpus = 0;
  },

  id : function() {
    return this._iId;
  },

  initId : function(iId) {
    if(this._iId === undefined){
      this._iId = iId;
    }
  },

  keyword : function() {
    return this._sKeyword;
  },

  referringHistoryItemsId : function() {
    return this._lReferringHistoryItemsId;
  },

  setReferringHistoryItemsId : function(lHistoryItemsId) {
    this._lReferringHistoryItemsId = lHistoryItemsId;
  },

  addReferringHistoryItemId : function(iHistoryItemId) {
    if(_.indexOf(this._lReferringHistoryItemsId, iHistoryItemId)===-1){
      this._lReferringHistoryItemsId.push(iHistoryItemId);
    }
  },

  referringStoriesId : function() {
    return this._lReferringStoriesId;
  },

  setReferringStoriesId : function(lStoriesId) {
    this._lReferringStoriesId = lStoriesId;
  },

  addReferringStoryId : function(iStoryId) {
    if(_.indexOf(this._lReferringStoriesId, iStoryId)===-1){
      this._lReferringStoriesId.push(iStoryId);
    }
  },

  frequency : function() {
    return this._iFrequencyInCorpus;
  },

  setFrequency : function(iFrequency) {
    this._iFrequencyInCorpus = iFrequency;
  },
});
