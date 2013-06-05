'use strict';

/**
 * HistoryItem
 *
 * Model.
 * Every visit on a page corresponds to a historyItem. If you visit the same
 * page twice but at a different moment you have the same historyItem.
 */
Cotton.Model.HistoryItem = Model.extend({
  _sModelStore: "historyItems",
  _oExtractedDNA : undefined,       // dna of the page. Used to compute distance.

  _default: function(){
    return {
      'sId': undefined, // {Int} id: of the historyItem in the cotton database.
      'sUrl': undefined, // {String} url: of the page.
      'sIitle': "", // {String} title: of the page.
      'iLastVisitTime': undefined, // {Int} last time we visit this page.
      'iVisitCount': 1, // {Int} number of time we visit this page.
      'sStoryId': "UNCLASSIFIED", // {Int} if is in a story, id of this story.
      'oExtractedDNA' : this._oExtractedDNA._default()
    };
  },
  /**
   * {Dictionnary} dDBRecord :
   *  dict that contains all the variables like they are stored in the
   *  database.
   */
  init : function(dDBRecord) {
    this._super(dDBRecord);
    this._oExtractedDNA = new Cotton.Model.HistoryItemDNA(this, dDBRecord['oExtractedDNA']);

  },
  // can't be set
  id : function() {
    return this.get('sId');
  },
  initId : function(sId) {
    if(this.get('sId') === undefined){this.set('sId', sId);}
  },
  url : function() {
    return this.get('sUrl');
  },
  initUrl : function(sUrl) {
    if(this.get('sUrl') === undefined){this.set('sUrl', sUrl);}
  },
  title : function() {
    return this.get('sTitle');
  },
  setTitle : function(sTitle) {
    this.set('sTitle', sTitle);
  },
  lastVisitTime : function() {
    return this.get('iLastVisitTime');
  },
  setLastVisitTime : function(iVisitTime) {
    this.set('iVisitTime', iVisitTime);
  },
  visitCount : function() {
    return this.get('iVisitCount', iVisitCount);
  },
  setVisitCount : function(iVisitCount) {
    this.set('iVisitCount', iVisitCount);
  },
  incrementVisitCount : function(iVisitsAdded) {
    if (iVisitsAdded) {
      this._iVisitCount += iVisitsAdded;
    } else {
      this._iVisitCount ++;
    }
  },
  storyId : function() {
    return this.get('sStoryId');
  },
  setStoryId : function(sStoryId) {
    this.set('sStoryId', sStoryId);
  },
  extractedDNA : function() {
    return this.get('oExtractedDNA', oExtractedDNA);
  },
  setExtractedDNA : function(oExtractedDNA) {
    this.set('oExtractedDNA', oExtractedDNA);
  },
  searchKeywords : function() {
    return this.get('sTitle').toLowerCase().split(" ");
  },
  oUrl : function() {
    if(!this._oUrl) {
      this._oUrl = new UrlParser(this.get('sUrl'));
    }
    return this._oUrl;
  }

});
