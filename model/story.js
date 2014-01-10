'use strict';

/**
 * Story
 *
 */
Cotton.Model.Story = Class.extend({

  _iId : null,

  _sTitle : undefined,
  _sFeaturedImage : undefined,

  _fLastVisitTime : undefined,
  _fRelevance : null,

  _lHistoryItemsId : null,
  _lHistoryItems : null,

  _lTags : null,
  _oDNA : null,

  /**
   *
   */
  init : function() {
    this._fLastVisitTime = 0;
    this._sTitle = "";
    this._sFeaturedImage = "";
    this._lHistoryItemsId = [];
    this._lHistoryItems = [];
    this._lHistoryItemsRecord = [];
    this._lTags = [];
    this._oDNA = new Cotton.Model.StoryDNA();
  },

  id : function() {
    return this._iId;
  },
  setId : function(iId) {
    this._iId = iId;
  },
  title : function() {
    return this._sTitle;
  },
  setTitle : function(sTitle) {
    this._sTitle = sTitle;
    this.computeTags();
  },
  featuredImage : function() {
    return this._sFeaturedImage;
  },
  setFeaturedImage : function(sFeaturedImage) {
    this._sFeaturedImage = sFeaturedImage;
  },

  length : function() {
    return this._lHistoryItems.length;
  },
  historyItems : function() {
    return this._lHistoryItems;
  },
  historyItemsId : function() {
    return this._lHistoryItemsId;
  },
  historyItemsRecord : function() {
    return this._lHistoryItemsRecord;
  },
  lastVisitTime : function() {
    return this._fLastVisitTime;
  },
  setLastVisitTime : function(fLastVisitTime) {
    this._fLastVisitTime = fLastVisitTime;
  },
  relevance : function() {
    return this._fRelevance;
  },
  setRelevance : function(fRelevance) {
    this._fRelevance = fRelevance;
  },
  tags : function() {
    return this._lTags;
  },
  setTags : function(lTags) {
    var self = this;
    self._lTags = lTags;
  },
  addTags : function(sTag) {
    this._lTags.push(sTag);
  },
  dna : function()  {
    return this._oDNA;
  },
  setDNA : function(oDNA) {
    this._oDNA = oDNA;
  },
  setFavorite : function(iFavoriteCode) {
    // 0 -> not favorite
    // 1 -> favorite
    this._bFavorite = iFavoriteCode ? 1 : 0;
  },
  isFavorite : function() {
    return this._bFavorite || 0;
  },
  setBannedFromSuggest : function(iBannedCode) {
    // 0 -> not banned
    // 1 -> banned
    this._bBannedFromSuggest = iBannedCode ? 1 : 0;
  },
  isBannedFromSuggest : function() {
    return this._bBannedFromSuggest || 0;
  },
  /**
   * Add a historyItem to the list parsing a dbRecordObject
   * - update list of historyItems id.
   * - update last visit time.
   *
   * @param {Object} oHistoryItemDbRecord
   */
  addDbRecordHistoryItem : function(oHistoryItemDbRecord) {
    if (this._lHistoryItemsId.indexOf(oHistoryItemDbRecord['id']) === -1) {
      this._lHistoryItemsId.push(oHistoryItemDbRecord['id']);
      this._lHistoryItemsRecord.push(oHistoryItemDbRecord);
    }
    if (oHistoryItemDbRecord['iLastVisitTime'] > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItemDbRecord['iLastVisitTime'];
    }
  },
  /**
   * Replace the whole DbRecord items list.
   *
   * @param {Array.<Object>} lHistoryItemsDbRecord
   */
  setDbRecordHistoryItems : function(lHistoryItemDbRecord) {
    this._lHistoryItemsRecord = lHistoryItemDbRecord;
    this._lHistoryItemsId = [];
    this._flastVisitTime = 0;
    var iLength = lHistoryItemDbRecord.length;
    for (var i = 0; i < iLength; i++){
      var dHistoryItemDbRecord = lHistoryItemDbRecord[i];
      this._lHistoryItemsId.push(dHistoryItemDbRecord['id']);
      if (this._flastVisitTime < dHistoryItemDbRecord['iLastVisitTime']){
        this._flastVisitTime = dHistoryItemDbRecord['iLastVisitTime'];
      }
    }
  },

  /**
   * Add an id to the list of historyItems id.
   * - check there is now duplicate id.
   *
   * @param {int} iHistoryItemId
   */
  addHistoryItemId : function(iHistoryItemId) {
    if (this._lHistoryItemsId.indexOf(iHistoryItemId) === -1) {
      this._lHistoryItemsId.push(iHistoryItemId);
    }
  },

  /**
   * Replace the whole history items list.
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
  setHistoryItems : function(lHistoryItems) {
    this._lHistoryItems = lHistoryItems;
  },
  /**
   * Replace the whole history items id list.
   *
   * @param {Array.<iHistoryItemId>} lHistoryItemsId
   */
  setHistoryItemsId : function(lHistoryItemsId) {
    this._lHistoryItemsId = lHistoryItemsId;
  },
  removeHistoryItem : function(sID) {
    this._lHistoryItemsId = _.reject(this._lHistoryItemsId, function(iHistoryItemId) {
      return iHistoryItemId === sID;
    });
    if(this._lHistoryItems){
      this._lHistoryItems = _.reject(this._lHistoryItems, function(oHistoryItem) {
      return oHistoryItem.id() === sID;
    });

    }
  },

  computeTags : function(){
    this.setTags(this._sTitle.toLowerCase().split(" "));
  },

  searchKeywords : function() {
    return this.dna().bagOfWords().preponderant();
  },
});
