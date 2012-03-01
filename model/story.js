'use strict';

Cotton.Model.Story = function(lHistoryItems) {
  // storyClass
  
  // DATA MODEL
  this._iID;
  this._lHistoryItems = new Array();
  this._fLastVisitTime = 0;
  
  
  if (lHistoryItems !== undefined) {
    this._lHistoryItems = lHistoryItems;
  }

};

// PROTOTYPE
$.extend(Cotton.Model.Story.prototype, {
  // GETTER
  id : function() {
    return this.iID;
  },
  length : function() {
    return this._lHistoryItems.length;
  },
  iter : function() {
  //  for(var i = 0; i < this._lHistoryItems.length; i++){
  //    yield this._lHistoryItems[i];
  //  }
    return this._lHistoryItems;
  },
  fLastVisitTime : function() {
    return this._fLastVisitTime;
  },
  // ADVANCED METHOD
  // handle historyItems
  addHistoryItem : function(oHistoryItems) {
    this._lHistoryItems.push(oHistoryItems);
    if (oHistoryItems.lastVisitTime > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItems.lastVisitTime;
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
  getHistoryItemPosition : function (sID){
    for(var i = 0; i < this.lHistoryItems; i++){
      if(this.lHistoryItems[i].id === sID){
        return i;
      }
    }
    return -1;
  },
  storySCAN : function() {
  },
  removeHistoryItem : function(sID){
    // TODO(rmoutard) : maybe use a temp trash
    this._lHistoryItems = _.reject(this._lHistoryItems, 
                          function(oHistoryItem){ 
                            return oHistoryItem.id === sID;
                          });
  },
  moveHistoryItem : function(sIDtoMove, sIDPrevious) {
    var lElementToMove = _.filter(this._lHistoryItems, 
                          function(oHistoryItem){ 
                            return oHistoryItem.id === sIDtoMove;
                          });
    if(lElementToMove.length > 0){
      var iNewPosition = 0;
      if(sIDPrevious !== undefined){
        iNewPosition = this.getHistoryItemPosition(sIDPrevious); 
      }
      this._lHistoryItems.splice(iNewPosition, 0, lElementToMove[0]);
    }
  } 
});
