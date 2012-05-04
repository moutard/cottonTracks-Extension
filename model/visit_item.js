'use strict';

Cotton.Model.VisitItem = function() {

  this._sId; // visitId.
  this._sChromeVisitId; // Should be the same that Google chrome history.
  this._sStoryId = "UNCLASSIFIED";

  // Information of historyItem that are pertinent with this model.
  this._sUrl;
  this._sTitle;
  this._iVisitTime;

  // Informations of historyItem that are NOT pertinent th this model.
  // this._iLastVisitTime;
  // this._iVisitCount;
  // this._iTypedCount;

  // Added by preTreatment
  // this._oUrl ?
  this._sPathname;
  this._sHostname;
  this._lQueryWords;
  this._lExtractedWords;
  this._sClosestGeneratedPage;

  // Improved model - only available for DBSCAN2
  this._oExtractedDNA = new Cotton.Model.ExtractedDNA();
};

$
    .extend(
        Cotton.Model.VisitItem.prototype,
        {
          // GETTER
          // can't be set
          id : function() {
            return this._sId;
          },
          chromeId : function() {
            return this._sChromeId;
          },
          url : function() {
            return this._sUrl;
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
          extractedDNA : function(){
            return this._oExtractedDNA;
          },
          // method
          getInfoFromPage : function() {
            this._sUrl = window.location.href;
            this._sTitle = window.document.title;
            this._iVisitTime = new Date().getTime();

            // This method is called in a content_script, but due to chrome
            // security
            // options maybe not work if not called by the extension.
            /*
             * chrome.history.getVisits({ 'url' : this._sUrl },
             * function(lVisitItems) { if(lVisitItems.length >
             * 0){this._sChromeId = lVisitItem[0].id; } } );
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
            //this._sId = dVisitItemSerialized._sId || undefined;
            //this._sChromeVisitId = dVisitItemSerialized || undefined;

            this._sUrl = dVisitItemSerialized._sUrl || '';
            this._sTilte = dVisitItemSerialized._sTitle || '';
            this._iVisitTime = dVisitItemSerialized._iVisitTime || 0;

            //this._lTextHighlighter = dVisitItemSerialized._lTextHighlighter;
            //this._iScrollCount = dVisitItemSerialized._iScrollCount;
            //this._lCopyPaste = dVisitItemSerialized._lCopyPaste;
            //this._lPScore = dVisitItemSerialized._lPScore;
          },
        });
