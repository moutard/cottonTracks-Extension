'use strict';

/**
 * Story
 *
 */

var dStoryIndexes = {
  // optional id is indexed automatically.
  'id' : {
    'unique' : true
  },
  'fLastVisitTime' : {
    'unique' : false
  },
  'lTags' : {
    'unique' : false,
    'multiEntry' : true
  },
};

Cotton.Model.Story = Cotton.DB.Model.extend({

  _sModelStore: "stories",
  _dModelIndexes: dStoryIndexes,

  _oDNA : null,
  // As we don't want those array are stored in the database directly they
  // are not in the default dbRecord.
  _lHistoryItemsRecord: [],
  _lHistoryItems: [],

  _default: function(){
    return {
      'id': undefined, // {Int} id: of the historyItem in the cotton database.
      'sTitle': "", // {String} title: of the story.
      'fLastVisitTime': 0, // {Int} last time we visit of an item that belongs to this story.
      'fRelevance': 1, // {Int} relevance.
      'sFeaturedImage': "",
      'lHistoryItemsId': [], // {Array.<Int>} }List of history items id that are in this story.
    };
  },

  /**
   *
   */
  init : function(dDBRecord) {
    this._super(dDBRecord);
    var dDNA = dDBRecord['oDNA'] || {};
    this._oDNA = new Cotton.Model.StoryDNA(dDNA);
    this._dDBRecord['oDNA'] = this._oDNA.dbRecord();
  },

  id : function() {
    return this.get('id');
  },
  setId : function(iId) {
    this.set('id', iId);
  },
  title : function() {
    return this.get('sTitle');
  },
  setTitle : function(sTitle) {
    this.set('sTitle', sTitle);
  },
  featuredImage : function() {
    return this.get('sFeaturedImage');
  },
  setFeaturedImage : function(sFeaturedImage) {
    this.set('sFeaturedImage', sFeaturedImage);
  },

  length : function() {
    return this.get('lHistoryItemsId').length;
  },
  historyItems : function() {
    return this._lHistoryItems;
  },
  historyItemsId : function() {
    return this.get('lHistoryItemsId');
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
    this.set('lHistoryItemsId', lHistoryItemsId);
  },

  lastVisitTime : function() {
    return this.get('flastVisitTime');
  },
  setLastVisitTime : function(fLastVisitTime) {
    this.set('fLastVisitTime', fLastVisitTime);
  },
  relevance : function() {
    return this.get('fRelevance');
  },
  setRelevance : function(fRelevance) {
    this.set('fRelevance', fRelevance);
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
   * @param {Dictionnary} dHistoryItemDbRecord
   */
  addDbRecordHistoryItem : function(dHistoryItemDbRecord) {
    var _lHistoryItemsId = this.get('lHistoryItemsId');
    if (_lHistoryItemsId.indexOf(dHistoryItemDbRecord['sId']) === -1) {
      _lHistoryItemsId.push(dHistoryItemDbRecord['sId']);
      this._lHistoryItemsRecord.push(dHistoryItemDbRecord);

      // FIXME(rmoutard): probleme between f and i !
      if (dHistoryItemDbRecord['iLastVisitTime'] > this.get('fLastVisitTime')) {
        this.set('fLastVisitTime', dHistoryItemDbRecord['iLastVisitTime']);
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
    var _lHistoryItemsId = this.get('lHistoryItemsId');
    if (_lHistoryItemsId.indexOf(iHistoryItemId) === -1) {
      _lHistoryItemsId.push(iHistoryItemId);
      this.set('lHistoryItemsId', _lHistoryItemsId);
    }
  },

  /**
   * Given a id of an historyItem remove it from the list of historyItems and
   * remove the id from the historyItemsId list.
   * @param sId: id of the historyItem you want to remove.
   */
  removeHistoryItem : function(sId) {
    //FIXME(rmoutard): do not use reject.
    var lHistoryItemsId = _.reject(this.get('lHistoryItemsId'), function(iHistoryItemId) {
      return iHistoryItemId === sId;
    });
    this.set('lHistoryItemsId', lHistoryItemsId);

    var lHistoryItems = _.reject(this.get('lHistoryItems'), function(oHistoryItem) {
      return oHistoryItem.id() === sId;
    });
    this.set('lHistoryItems', lHistoryItems);

  },

  searchKeywords : function() {
    return this.dna().bagOfWords().preponderant();
  }

});
