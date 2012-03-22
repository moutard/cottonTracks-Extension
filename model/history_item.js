'use strict';
//TODO(rmoutard)  ask to fwouts if we store a duplicate of the history items
// parameters or if we store only expanded parameters
Cotton.Model.HistoryItem = function () {
  // Current chrome API model
  this._sId;
  this._sChromeId; // Should be the same that Google chrome history.
  this._sUrl; // Can be use as unique identifier.
  this._sTitle;
  this._iLastVisitTime;
  this._iVisitCount;
  this._iTypedCount;

  // Added by preTreatment
  // this._oUrl ?
  this._sPathname;
  this._sHostname;
  this._lQueryWords;
  this._lExtractedWords;

  // Improved model - only available for DBSCAN2
  // TODO(rmoutard) : see with fwouts the model of textHighLigter
  this._lTextHighlighter = [];
  this._iScrollCount = 0;
  this._lCopyPaste = [];

};

$.extend(Cotton.Model.HistoryItem.prototype, {
  //GETTER
  // can't be set
  id  :   function() { return this._sId; },
  chromeId : function() { return this._sChromeId; },
  url :   function() { return this._sUrl; },
  title : function() { return this._sTitle; },

  // can be set
  lastVisitTime : function() { return this._iLastVisitTime; },
  setLastVisitTime : function(lastVisitTime){
    this._iLastVisitTime = lastVisitTime;
  },
  visitCount :    function() { return this._iVisitCount; },
  setVisitCount : function(visitCount) {this._iVisitCount = visitCount;},
  typedCount :    function() { return this._iTypedCount; },
  setTypedCount : function(typedCount) { this._iTypedCount = typedCount;},

  // expanded
  textHighLighter : function() { return this._sTextHighlighter; },
  setTextHighLighter : function(highLight) {
    this._sTextHighlighter.push(highLight);
  },
  scrollCount : function() { return this._iScrollCount; },
  setScrollCount : function(scrollCount) { this._iScrollCount = scrollCount;},
  copyPaste : function() { return this._lCopyPaste; },
  setCopyPaste : function(copyPaste) { this._lCopyPaste.push(copyPaste); },

  // method
  getInfoFromPage : function() {
    this._sUrl = window.location.href;
    this._sTitle = document.title;
    this._iLastVisitTime = new Date().getTime();

    // maybe not work if not called by the extension.
    /*
    chrome.history.getVisits({ 'url' : this._sUrl },
        function(lVisitItems) {
          if(lVisitItems.length > 0){this._sChromeId = lVisitItem[0].id; }
        }
    );
    */
  },
});
