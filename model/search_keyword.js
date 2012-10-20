'use strict';

/**
 * Search Keyword
 */
Cotton.Model.SearchKeyword = Class.extend({

  _iId : undefined,
  _sKeyword : undefined,
  _lReferringVisitItemsId : [],
  _lReferringStoriesId : [],

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
    this._lReferringVisitItemsId.push(iVisitItemId);
  },

  referringStoriesId : function() {
    return this._lReferringStoriesId;
  },

  setReferringStoriesId : function(lStoriesId) {
    this._lReferringStoriesId = lStoriesId;
  },

  addReferringStoryId : function(iStoryId) {
    this._lReferringStoriesId.push(iStoryId);
  },

});