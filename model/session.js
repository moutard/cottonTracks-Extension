'use strict';
// Why : using time and keywords in Cotton.Algo.Distance we can easily detect
// sessions (even parallel session) Then you can group session. 
//

Cotton.Model.Session = function(lHistoryItems){
  // Class 
  
  // DATA MODEL
  this._iId;
  this._lHistoryItems = new Array();
  this._fLastVisitTime = 0;
  this._fRelevance;
  this._lKeywords = new Array();
  if (lHistoryItems !== undefined) {
    this._lHistoryItems = lHistoryItems;
  }

};

// PROTOTYPE
$.extend(Cotton.Model.Story.prototype, {
  computeKeywords : function(){
    for (var i = 0, oHistoryItem; oHistoryItem = this._lHistoryItems[i]; i++ ){
      this._lKeywords = this._lKeywords.concat(oHistoryItem.keywords);
    }
  },

});
