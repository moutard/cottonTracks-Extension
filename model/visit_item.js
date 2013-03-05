'use strict';

/**
 * VisitItem
 *
 * Model.
 * Each visti on a page corresponds to a vistitItem. If you visit the same
 * page twice but at a different moment you create a second visitItem.
 */
Cotton.Model.VisitItem = Class
    .extend({

      _sId : undefined,                 // id fixed by the database.
      _sStoryId : "UNCLASSIFIED",       // id of the story if it belongs to it.
      _iPool : 0,                       // is not in the pool by default.

      _sUrl : undefined,                // url of the visited page.
      _sTitle : "",                     // title of the page.
      _iVisitTime : undefined,          // time of the visit.

      _oExtractedDNA : undefined,       // dna of the page. Used to compute distance.

      /**
       * @constructor
       */
      init : function() {
        this._oExtractedDNA = new Cotton.Model.VisitItemDNA(this);
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
      visitTime : function() {
        return this._iVisitTime;
      },
      setVisitTime : function(iVisitTime) {
        this._iVisitTime = iVisitTime;
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

      // method
      getInfoFromPage : function() {
        this._sUrl = window.location.href;
        this._sTitle = window.document.title;
        this._iVisitTime = new Date().getTime();
        this._sReferrerUrl = document.referrer;

      },

      searchKeywords : function() {
        return this._sTitle.toLowerCase().split(" ");
      },
    });
