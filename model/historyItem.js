'use strict';
//TODO(rmoutard)  ask to fwouts if we store a duplicate of the history items
// parameters or if we store only expanded parameters
Cotton.Model.HistoryItem = function () {
  // Current chrome API model
  this._sID;
  this._sUrl;
  this._sTitle;
  this._iLastVisitTime;
  this._iVisitCount;
  this._iTypedCount;

  // Improved model - only available for DBSCAN2
  // TODO(rmoutard) : see with fwouts the model of textHighLigter
  this._sTextHighlighter;
  this._fReaderRatio;
  this._iNewTab;

};

$.extend(Cotton.Model.HistoryItem.prototype, {
  //GETTER
  id  :   function() { return this._sID; },
  url :   function() { return this._sUrl; },
  title : function() { return this._sTitle; },
  lastVisitTime : function() { return this._iLastVisitTime; },
  visitCount :    function() { return this._iVisitCount; },
  typedCount :    function() { return this._iTypedCount; },

  textHighLighter : function() { return this._sTextHighlighter; },
  readerRatio     : function() { return this._fReaderRatio; },
  newTab          : function() { return this._iNewTab; }
});
