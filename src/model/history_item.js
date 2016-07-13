'use strict';

/**
 * HistoryItem
 *
 * Model.
 * Every visit on a page corresponds to a historyItem. If you visit the same
 * page twice but at a different moment you have the same historyItem.
 */
Cotton.Model.HistoryItem = Class.extend({

  _sId : undefined,                 // id fixed by the database.

  _sUrl : undefined,                // url of the visited page.
  _sTitle : undefined,              // title of the page.
  _iLastVisitTime : undefined,      // time of the last visit.
  _iVisitCount : undefined,         // number of visits for this item.

  _sStoryId : undefined,            // id of the story if it belongs to it.
  _oExtractedDNA : undefined,       // dna of the page. Used to compute distance.
  _iChromeId : undefined,           // id in chrome database, use during populate. (use parseInt to make it an int)
  /**
   * {Dictionnary} dDBRecord :
   *  dict that contains all the variables like they are stored in the
   *  database.
   */
  init : function(dDBRecord) {
    dDBRecord = dDBRecord || {};
    this._sId = dDBRecord['id'] || undefined;

    this._sUrl = dDBRecord['sUrl'] || undefined;
    this._sTitle = dDBRecord['sTitle'] || "";
    this._iLastVisitTime = dDBRecord['iLastVisitTime'] || undefined;
    this._iVisitCount = dDBRecord['iVisitCount'] || 1;

    this._sStoryId = dDBRecord['sStoryId'] || "UNCLASSIFIED";
    this._oExtractedDNA = new Cotton.Model.HistoryItemDNA(dDBRecord['oExtractedDNA']);
    this._iChromeId = dDBRecord['sChromeId'] || undefined;
  },
  // can't be set
  id : function() {
    return this._sId;
  },
  initId : function(sId) {
    if(this._sId === undefined){this._sId = sId;}
  },
  url : function() {
    return this._sUrl;
  },
  initUrl : function(sUrl) {
    if(!this._sUrl){this._sUrl = sUrl;}
  },
  title : function() {
    return this._sTitle;
  },
  setTitle : function(sTitle) {
    this._sTitle = sTitle;
  },
  lastVisitTime : function() {
    return this._iLastVisitTime;
  },
  setLastVisitTime : function(iVisitTime) {
    this._iLastVisitTime = iVisitTime;
  },
  visitCount : function() {
    return this._iVisitCount;
  },
  setVisitCount : function(iVisitCount) {
    if (iVisitCount && iVisitCount > 0){
      this._iVisitCount = iVisitCount;
    } else {
      this._iVisitCount = 1;
    }
  },
  incrementVisitCount : function(iVisitsAdded) {
    if (iVisitsAdded) {
      this._iVisitCount += iVisitsAdded;
    } else {
      this._iVisitCount ++;
    }
  },
  storyId : function() {
    return this._sStoryId;
  },
  setStoryId : function(sStoryId) {
    this._sStoryId = sStoryId;
  },
  removeStoryId : function() {
    if (this._sStoryId){
      this._sStoryId = undefined;
    }
  },
  extractedDNA : function() {
    return this._oExtractedDNA;
  },
  setExtractedDNA : function(oExtractedDNA) {
    this._oExtractedDNA = oExtractedDNA;
  },
  searchKeywords : function() {
    return this._sTitle.toLowerCase().split(" ");
  },
  oUrl : function() {
    if(!this._oUrl) {
      this._oUrl = new UrlParser(this._sUrl);
    }
    return this._oUrl;
  },
  chromeId : function() {
    return this._iChromeId;
  },
  setChromeId : function(iChromeId) {
    this._iChromeId = iChromeId;
  },

});
