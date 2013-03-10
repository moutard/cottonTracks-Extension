'use strict';

/**
 * Story
 *
 */
Cotton.Model.Story = Class.extend({

  _iId : null,

  _sTitle : "",
  _sFeaturedImage : "",

  _fLastVisitTime : 0,
  _fRelevance : null,

  _lHistoryItemsId : [],
  _lHistoryItems : [],

  _lTags : [],
  _oDNA : null,

  /**
   * @constructor
   */
  init : function() {
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
  iter : function() {
    // for(var i = 0; i < this._lHistoryItems.length; i++){
    // yield this._lHistoryItems[i];
    // }
    return this._lHistoryItemsId;
  },
  historyItemsId : function() {
    return this._lHistoryItemsId;
  },
  setHistoryItemsId : function(lHistoryItemsId) {
    this._lHistoryItemsId = lHistoryItemsId;
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
    _.each(self._lTags, function(sWord){
      self._oDNA.bagOfWords().addWord(sWord, 5);
    });
  },
  addTags : function(sTag) {
    this._lTags.push(sTag);
    self._oDNA.bagOfWords().addWord(sTag, 5);
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
    var self = this;
    if (_.indexOf(this._lHistoryItemsId, oHistoryItemDbRecord['id']) === -1) {
      this._lHistoryItemsId.push(oHistoryItemDbRecord['id']);

      if (oHistoryItemDbRecord['iVisitTime'] > this._fLastVisitTime) {
        this._fLastVisitTime = oHistoryItemDbRecord['iVisitTime'];
      }
    }
  },

  /**
   * Add a historyItem to the list.
   * - update list of historyItems id.
   * - update last visit time.
   *
   * @param {Cotton.UI.HistoryItem} oHistoryItem
   */
  addHistoryItem : function(oHistoryItem) {
    if (_.indexOf(this._lHistoryItemsId, oHistoryItem.id()) === -1) {
      this._lHistoryItemsId.push(oHistoryItem.id());
      this._lHistoryItems.push(oHistoryItem);
      if (oHistoryItem.lastVisitTime() > this._fLastVisitTime) {
        this._fLastVisitTime = oHistoryItem.lastVisitTime();
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
    if (_.indexOf(this._lHistoryItemsId, iHistoryItemId) === -1) {
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

  maxHistoryItemId : function() {
    return _.max(this._lHistoryItemsId);
  },
  firstHistoryItem : function() {
    return this._lHistoryItemsId[0];
  },
  lastHistoryItem : function() {
    return this._lHistoryItemsId[lHistoryItems.length - 1];
  },
  historyItemPosition : function(sID) {
    for ( var i = 0; i < this.lHistoryItemsId; i++) {
      if (this.lHistoryItems[i] === sID) {
        return i;
      }
    }
    return -1;
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

  merge : function(oStory) {
    this._lHistoryItemsId = _.union(this._lHistoryItemsId, oStory.iter());
    this._fLastVisitTime = Math.max(this._fLastVisitTime, oStory
        .lastVisitTime());
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
        var reg = new RegExp(".(jpg|png|gif)$", "g");
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
    return this._sTitle.toLowerCase().split(" ");
  },
});
