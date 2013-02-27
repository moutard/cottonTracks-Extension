'use strict';

/**
 * Search Keyword
 */
Cotton.Model.SearchKeyword = Class.extend({

  _iId : undefined,
  _sKeyword : undefined,
  _lReferringVisitItemsId : [],   // list of visitItems that contains this word.
  _lReferringStoriesId : [],      // list of stories that contains this word.

  /**
   * {Integer} _iFrequencyInCorpus :
   * Number of times word appears in all pages. Allow to compute idf (inverse
   * document frequency). More the words appears less it is important:
   *  - because it can be a stop words (verbs like be, go, and conjugaison)
   *  - imagine all the corpus talk about javascript, then javascript becomes
   *  less important to classified, we want something smaller.
   */
  _iFrequencyInCorpus : 0,

  /**
   * @constructor
   */
  init : function(sKeyword) {
    this._sKeyword = sKeyword;
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

  referringVisitItemsId : function() {
    return this._lReferringVisitItemsId;
  },

  setReferringVisitItemsId : function(lVisitItemsId) {
    this._lReferringVisitItemsId = lVisitItemsId;
  },

  addReferringVisitItemId : function(iVisitItemId) {
    if(_.indexOf(this._lReferringVisitItemsId, iVisitItemId)===-1){
      this._lReferringVisitItemsId.push(iVisitItemId);
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
