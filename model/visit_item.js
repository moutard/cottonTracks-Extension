'use strict';

/**
 * VisitItem
 */
Cotton.Model.VisitItem = Class
    .extend({

      _sId : undefined, // visitId.
      _sChromeVisitId : undefined, // Should be the same that Google chrome
                                    // history
      _sChromeReferringVisitId : undefined,
      _sStoryId : "UNCLASSIFIED",

      // Information of historyItem that are pertinent with this model.
      _sUrl : undefined,
      _sReferrerUrl : undefined,
      _sTitle : "",
      _iVisitTime : undefined,

      // Added by preTreatment
      // this._oUrl ?
      _sPathname : undefined,
      _sHostname : undefined,
      _lQueryWords : [],
      _lExtractedWords : [],
      _sClosestGeneratedPage : undefined,

      // Improved model - only available for DBSCAN2
      _oExtractedDNA : undefined,

      /**
       * @constructor
       */
      init : function() {

        this._sStoryId = "UNCLASSIFIED";

        // Information of historyItem that are pertinent with this model.
        this._sUrl;
        this._sReferrerUrl;
        this._sTitle = "";
        this._iVisitTime;

        // Informations of historyItem that are NOT pertinent th this model.
        // this._iLastVisitTime;
        // this._iVisitCount;
        // this._iTypedCount;

        // Added by preTreatment
        // this._oUrl ?
        this._sPathname;
        this._sHostname;
        this._lQueryWords = [];
        this._lExtractedWords = [];
        this._sClosestGeneratedPage;

        // Improved model - only available for DBSCAN2
        this._oExtractedDNA = new Cotton.Model.ExtractedDNA();
      },
      // GETTER
      // can't be set
      id : function() {
        return this._sId;
      },
      chromeId : function() {
        return this._sChromeId;
      },
      chromeReferringVisitId : function() {
        return this._sChromeReferringVisitId;
      },
      setChromeReferringVisitId : function(sChromeReferringVisitId) {
        this._sChromeReferringVisitId = sChromeReferringVisitId;
      },
      url : function() {
        return this._sUrl;
      },
      referrerUrl : function() {
        return this._sReferrerUrl;
      },
      title : function() {
        return this._sTitle;
      },
      visitTime : function() {
        return this._iVisitTime;
      },

      //
      storyId : function() {
        return this._sStoryId;
      },
      setStoryId : function(sStoryId) {
        this._sStoryId = sStoryId;
      },
      pathname : function() {
        return this._sPathname;
      },
      setPathname : function(sPathname) {
        this._sPathname = sPathname;
      },
      hostname : function() {
        return this._sHostname;
      },
      setHostname : function(sHostname) {
        this._sHostname = sHostname;
      },
      queryWords : function() {
        return this._lQueryWords;
      },
      setQueryWords : function(lQueryWords) {
        this._lQueryWords = lQueryWords;
      },
      extractedWords : function() {
        return this._lExtractedWords;
      },
      setExtractedWords : function(lExtractedWords) {
        this._lExtractedWords = lExtractedWords;
      },
      closestGeneratedPage : function() {
        return this._sClosestGeneratedPage;
      },
      setClosestGeneratedPage : function(sClosestGeneratedPage) {
        this._sClosestGeneratedPage = sClosestGeneratedPage;
      },
      // expanded
      extractedDNA : function() {
        return this._oExtractedDNA;
      },
      // method
      getInfoFromPage : function() {
        this._sUrl = window.location.href;
        this._sTitle = window.document.title;
        this._iVisitTime = new Date().getTime();
        this._sReferrerUrl = document.referrer;

        // This method is called in a content_script, but due to chrome
        // security
        // options maybe not work if not called by the extension.
        /*
         * chrome.history.getVisits({ 'url' : this._sUrl },
         * function(lVisitItems) { if(lVisitItems.length > 0){this._sChromeId =
         * lVisitItem[0].id; } } );
         */
      },
      concat : function(oNewVisitItem) {
        // TODO(rmoutard) : check the default value is undefined.
        if (oNewVisitItem.id() === undefined
            && oNewVisitItem.url() === this.url()) {
          // TODO(rmoutard) : depends on how you update historyItem
          // in the file content_script_listener.
          this._sTextHighlighter = concat(this._sTextHighlighter,
              oNewVisitItem.textHighLighter);
          this.setScrollCount(oNewVisitItem.scrollCount());
          // TODO(rmoutard) complete the list.
        } else {
          console
              .log("Conflict : Can't update historyItem with two differents id");
        }
      },
      deserialize : function(dVisitItemSerialized) {
        // Use to restore a visitItem after it has been serialized by a worker.
        this._sId = dVisitItemSerialized._sId || undefined;
        // this._sChromeVisitId = dVisitItemSerialized || undefined;

        this._sUrl = dVisitItemSerialized._sUrl || '';
        this._sReferrerUrl = dVisitItemSerialized._sReferrerUrl || '';
        this._sTitle = dVisitItemSerialized._sTitle || '';
        this._iVisitTime = dVisitItemSerialized._iVisitTime || 0;

        this._lQueryWords = dVisitItemSerialized._lQueryWords || [];
        this._lExtractedWords = dVisitItemSerialized._lExtractedWords || [];

        // Extracted DNA
        this._oExtractedDNA._sImageUrl = dVisitItemSerialized._oExtractedDNA._sImageUrl
            || "";
        this._oExtractedDNA._lHighlightedText = dVisitItemSerialized._oExtractedDNA._lHighlightedText
            || [];
        this._oExtractedDNA._iPercent = dVisitItemSerialized._oExtractedDNA._iPercent || 0;
        this._oExtractedDNA._fPageScore = dVisitItemSerialized._oExtractedDNA._fPageScore;
        this._oExtractedDNA._sFirstParagraph = dVisitItemSerialized._oExtractedDNA._sFirstParagraph;
      },
    });
