'use strict';

/**
 * Cheesecake
 *
 */
Cotton.Model.Cheesecake = Class.extend({

  _iId : null,

  _sTitle : undefined,
  _sFeaturedImage : undefined,

  _fLastVisitTime : undefined,

  _lHistoryItemsId : null,
  _lHistoryItems : null,

  _lHistoryItemsSuggestId : null,
  _lHistoryItemsSuggest : null,

  _lHistoryItemsExcludeId : null,
  _lHistoryItemsExclude : null,

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
    this._lHistoryItemsSuggestId = [];
    this._lHistoryItemsSuggest = [];
    this._lHistoryItemsExcludeId = [];
    this._lHistoryItemsExclude = [];
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
  },
  featuredImage : function() {
    return this._sFeaturedImage;
  },
  setFeaturedImage : function(sFeaturedImage) {
    this._sFeaturedImage = sFeaturedImage;
  },
  historyItems : function() {
    return this._lHistoryItems;
  },
  historyItemsId : function() {
    return this._lHistoryItemsId;
  },
  historyItemsSuggest : function() {
    return this._lHistoryItemsSuggest;
  },
  historyItemsSuggestId : function() {
    return this._lHistoryItemsSuggestId;
  },
  historyItemsExclude : function() {
    return this._lHistoryItemsExclude;
  },
  historyItemsExcludeId : function() {
    return this._lHistoryItemsExcludeId;
  },
  lastVisitTime : function() {
    return this._fLastVisitTime;
  },
  setLastVisitTime : function(fLastVisitTime) {
    this._fLastVisitTime = fLastVisitTime;
  },
  dna : function()  {
    return this._oDNA;
  },
  setDNA : function(oDNA) {
    this._oDNA = oDNA;
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
   * Add a historyItem to the list of historyItems.
   *
   * @param {Cotton.Model.HistoryItem} oHistoryItem
   */
  addHistoryItem : function(oHistoryItem) {
    var iHistoryItemId = oHistoryItem.id();
    if (this._lHistoryItemsId.indexOf(iHistoryItemId) === -1) {
      this._lHistoryItems.push(oHistoryItem);
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
  /**
   * Remove a history item from the list
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
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
  /**
   * Add an id to the list of suggested historyItems id.
   * - check there is now duplicate id.
   *
   * @param {int} iHistoryItemId
   */
  addHistoryItemSuggestId : function(iHistoryItemId) {
    if (this._lHistoryItemsSuggestId.indexOf(iHistoryItemId) === -1
      && this._lHistoryItemsId.indexOf(iHistoryItemId) === -1
      && this._lHistoryItemsExcludeId.indexOf(iHistoryItemId) === -1) {
      this._lHistoryItemsSuggestId.push(iHistoryItemId);
    }
  },
  /**
   * Replace the whole history items suggestion list.
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
  setHistoryItemsSuggest : function(lHistoryItems) {
    this._lHistoryItemsSuggest = [];
    var iLength = lHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      var iHistoryItemId = lHistoryItems[i].id();
      if (this._lHistoryItemsSuggestId.indexOf(iHistoryItemId) === -1
        && this._lHistoryItemsId.indexOf(iHistoryItemId) === -1
        && this._lHistoryItemsExcludeId.indexOf(iHistoryItemId) === -1) {
        this._lHistoryItemsSuggest.push(lHistoryItems[i]);
      }
    }
  },
  /**
   * Replace the whole history items suggestion id list.
   *
   * @param {Array.<iHistoryItemId>} lHistoryItemsId
   */
  setHistoryItemsSuggestId : function(lHistoryItemsId) {
    var iLength = lHistoryItemsId.length;
    for (var i = 0; i < iLength; i++) {
      this.addHistoryItemSuggestId(lHistoryItemsId);
    }
  },
  /**
   * Remove a history item from the suggested list
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
  removeHistoryItemSuggest : function(sID) {
    this._lHistoryItemsSuggestId = _.reject(this._lHistoryItemsSuggestId, function(iHistoryItemId) {
      return iHistoryItemId === sID;
    });
    if(this._lHistoryItemsSuggest){
      this._lHistoryItemsSuggest = _.reject(this._lHistoryItemsSuggest, function(oHistoryItem) {
        return oHistoryItem.id() === sID;
      });
    }
  },
  /**
   * Add an id to the list of suggested historyItems id.
   * - check there is now duplicate id.
   *
   * @param {int} iHistoryItemId
   */
  addHistoryItemExcludeId : function(iHistoryItemId) {
    if (this._lHistoryItemsExcludeId.indexOf(iHistoryItemId) === -1) {
      this._lHistoryItemsExcludeId.push(iHistoryItemId);
      this.removeHistoryItemSuggest(iHistoryItemId);
    }
  },
  /**
   * Replace the whole excluded history items list.
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
  setHistoryItemsExclude : function(lHistoryItems) {
    this._lHistoryItemsExclude = lHistoryItems;
  },
  /**
   * Replace the whole excluded history items id list.
   *
   * @param {Array.<iHistoryItemId>} lHistoryItemsId
   */
  setHistoryItemsExcludeId : function(lHistoryItemsId) {
    this._lHistoryItemsExcludeId = lHistoryItemsId;
  },
  /**
   * Remove a history item from the excluded list
   *
   * @param {Array.<Cotton.Model.HistoryItem>} lHistoryItems
   */
  removeHistoryItemExclude : function(sID) {
    this._lHistoryItemsExcludeId = _.reject(this._lHistoryItemsExcludeId, function(iHistoryItemId) {
      return iHistoryItemId === sID;
    });
    if(this._lHistoryItemsExclude){
      this._lHistoryItemsExclude = _.reject(this._lHistoryItemsExclude, function(oHistoryItem) {
        return oHistoryItem.id() === sID;
      });
    }
  }
});
