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

      if (oHistoryItemDbRecord['iLastVisitTime'] > this._fLastVisitTime) {
        this._fLastVisitTime = oHistoryItemDbRecord['iLastVisitTime'];
      }
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
    for (var i = 0, dHistoryItemDbRecord; dHistoryItemDbRecord = lHistoryItemDbRecord[i]; i++){
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

  /**
   * compute the title of the story. If a google search exists then return
   * associated keywords. If not most frequent keywords are not really pertinent
   * because the order is weird. So return the title of the first page.
   *
   * TODO(rmoutard) : give the title of the page that contains the more of the
   * most frequent keywords.
   */
  computeTitle : function() {
    /** We can't recompute the title if it already exists */
    if (this._lHistoryItems.length !== 0) {
      var lKeywords = new Array();
      for ( var i = 0, oHistoryItem; oHistoryItem = this._lHistoryItems[i]; i++) {
        lKeywords = lKeywords.concat(oHistoryItem.extractedWords());
        if (oHistoryItem.queryWords().length !== 0) {
          this._sTitle = oHistoryItem.queryWords().join(" ");
          return;
        }
        this._sTitle = oHistoryItem.extractedWords().slice(0, 5).join(" ");
      }

      /**
       * Most Frequent keywords. - All the keywords are in the array lKeywords -
       * Reject small keywords - Hard formula that gives the most frequent
       * keywords.
       */
      lKeywords = _.reject(lKeywords, function(s) {
        return s.length < 4;
      });

      var lMostFrequentKeywords = _.map(
          _.sortBy(_.values(_.groupBy(lKeywords, function(iI) {
            return iI;
          })), function(l) {
            return -l.length;
          }), function(l) {
            return l[0];
          }).slice(0, 3);
      // this._sTitle = lMostFrequentKeywords.join(" ");

      if (this._sTitle === "" | this._sTitle === undefined) {
        this._sTitle = this._lHistoryItems[0].title();
      }
      return;
    } else {
      this._sTitle = 'Unknown22';
    }
  },

  computeFeaturedImage : function() {
    if (this._sFeaturedImage === "") {
      if (this._lHistoryItems.length !== 0) {
        var reg = new RegExp(".(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$", "g");
        for ( var i = 0, oHistoryItem; oHistoryItem = this._lHistoryItems[i]; i++) {
          if (reg.exec(oHistoryItem.url())) {
            this._sFeaturedImage = oHistoryItem.url();
            return;
          }
          if (oHistoryItem.extractedDNA().imageUrl() !== "") {
            this._sFeaturedImage = oHistoryItem.extractedDNA().imageUrl();
          }
        }
      }
    }
  },

  computeTags : function(){
    this.setTags(this._sTitle.toLowerCase().split(" "));
  },

  searchKeywords : function() {
    return this.dna().bagOfWords().preponderant();
  },
});
