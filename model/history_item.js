'use strict';

/**
 * HistoryItem
 *
 * Model.
 * Every visit on a page corresponds to a historyItem. If you visit the same
 * page twice but at a different moment you have the same historyItem.
 */
Cotton.Model.HistoryItem = Class
    .extend({

      _sId : undefined,                 // id fixed by the database.
      _sStoryId : undefined,       // id of the story if it belongs to it.
      _iPool : undefined,               // is not in the pool by default.

      _sUrl : undefined,                // url of the visited page.
      _sTitle : undefined,                     // title of the page.
      _iLastVisitTime : undefined,      // time of the last visit.

      _oExtractedDNA : undefined,       // dna of the page. Used to compute distance.

      /**
       * @constructor
       */
      init : function() {
        this._oExtractedDNA = new Cotton.Model.HistoryItemDNA(this);
        this._sStoryId = "UNCLASSIFIED";
        this._iPool = 0;
        this._sTitle = "";
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
      storyId : function() {
        return this._sStoryId;
      },
      setStoryId : function(sStoryId) {
        this._sStoryId = sStoryId;
      },
      pool : function() {
        return this._iPool;
      },
      setPool : function(iPool) {
        this._iPool = iPool;
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
    });
