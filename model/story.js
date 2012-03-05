'use strict';

Cotton.Model.Story = function(lHistoryItems) {
  // storyClass

  // DATA MODEL
  this._iId;
  this._lHistoryItems = new Array();
  this._fLastVisitTime = 0;
  this._fRelevance;

  if (lHistoryItems !== undefined) {
    this._lHistoryItems = lHistoryItems;
  }

};

// PROTOTYPE
$.extend(Cotton.Model.Story.prototype, {
  // GETTER
  id : function() {
    return this._iId;
  },
  setId : function(iId) {
    this._iId = iId;
  },
  length : function() {
    return this._lHistoryItems.length;
  },
  iter : function() {
    // for(var i = 0; i < this._lHistoryItems.length; i++){
    // yield this._lHistoryItems[i];
    // }
    return this._lHistoryItems;
  },
  lastVisitTime : function() {
    return this._fLastVisitTime;
  },
  relevance : function() {
    return this._fRelevance;
  },
  setRelevance : function(fRelevance){
    this._fRelevance = fRelevance;
  },
  // ADVANCED METHOD
  // handle historyItems
  addHistoryItem : function(oHistoryItems) {
    this._lHistoryItems.push(oHistoryItems);
    if (oHistoryItems.lastVisitTime > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItems.lastVisitTime;
    }
  },
  // TODO: Remove the "get" from simple getters, add "compute" prefix to complex
  // ones.
  getStartPoint : function() {
    return this._lHistoryItems[0];
  },
  getEndPoint : function() {
    return this._lHistoryItems[lHistoryItems.length - 1];
  },
  getMainPoint : function() {
  },
  getHistoryItemPosition : function(sID) {
    for ( var i = 0; i < this.lHistoryItems; i++) {
      if (this.lHistoryItems[i].id === sID) {
        return i;
      }
    }
    return -1;
  },
  storySCAN : function() {
  },
  removeHistoryItem : function(sID) {
    // TODO(rmoutard) : maybe use a temp trash
    this._lHistoryItems = _.reject(this._lHistoryItems, function(oHistoryItem) {
      return oHistoryItem.id === sID;
    });
  },
  moveHistoryItem : function(sIDtoMove, sIDPrevious) {
    var lElementToMove = _.filter(this._lHistoryItems, function(oHistoryItem) {
      return oHistoryItem.id === sIDtoMove;
    });
    if (lElementToMove.length > 0) {
      var iNewPosition = 0;
      if (sIDPrevious !== undefined) {
        iNewPosition = this.getHistoryItemPosition(sIDPrevious);
      }
      this._lHistoryItems.splice(iNewPosition, 0, lElementToMove[0]);
    }
  },
  countSearchPathname : function() {
    var lTemp = _.filter(this._lHistoryItems, function(oHistoryItem) {
      // TODO(rmoutard) : not really a clean solution.
      // see pretreatment
      return oHistoryItem.pathname === "/search";
    });
    return lTemp.length;
  },
  countUniqHostname : function() {
    var lTemp = _.uniq(this._lHistoryItems, false, function(oHistoryItem) {
      return oHistoryItem.hostname;
    });
    return lTemp.length;
  },
  computeRelevance : function() {
    // Compute the relevance of the story.
    // some crtieria may be interesting :
    // - length
    // - lastVisitTime
    // - number of different hostname
    // - number of /search path name
    // please complete the list.

    var coeff = Cotton.Config.Parameters.computeRelevanceCoeff;

    this._fRelevance = coeff.length * this.length() + coeff.lastVisitTime
        * (this._fLastVisitTime / new Date().getTime()) + coeff.hostname * this.countUniqHostname()
        + coeff.search * this.countSearchPathname();

  }
});
