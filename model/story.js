'use strict';

Cotton.Model.Story = function(lHistoryItems) {
  // storyClass

  if (lHistoryItems === undefined) {
   this._lHistoryItems = new Array();
  } else {
    this._lHistoryItems = lHistoryItems;
  }
  this._fLastVisitTime = 0;

};

// PROTOTYPE
$.extend(Cotton.Model.Story.prototype, {
  length : function() {
    return this._lHistoryItems.length;
  },
  addHistoryItem : function(oHistoryItems) {
    this._lHistoryItems.push(oHistoryItems);
    if (oHistoryItems.lastVisitTime > this._fLastVisit) {
      this._fLastVisit = oHistoryItems.lastVisitTime;
    }
  },
  getStartPoint : function() {
    return this._lHistoryItems[0];
  },
  getEndPoint : function() {
    return this._lHistoryItems[lHistoryItems.length - 1];
  },
  getMainPoint : function() {
  },
  storySCAN : function() {
  }
});
