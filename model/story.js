'use strict';

Cotton.Model.Story = function(lVisitItems) {
  // storyClass

  // DATA MODEL
  this._iId;
  this._fLastVisitTime = 0;
  this._fRelevance;

  this._lVisitItemsId = new Array();

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
    return this._lVisitItems.length;
  },
  iter : function() {
    // for(var i = 0; i < this._lHistoryItems.length; i++){
    // yield this._lHistoryItems[i];
    // }
    return this._lVisitItems;
  },
  lastVisitTime : function() {
    return this._fLastVisitTime;
  },
  relevance : function() {
    return this._fRelevance;
  },
  setRelevance : function(fRelevance) {
    this._fRelevance = fRelevance;
  },
  // ADVANCED METHOD
  // handle historyItems
  addHistoryItem : function(oHistoryItem) {
    this._lHistoryItems.push(oHistoryItem);
    if (oVisitItem.lastVisitTime > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItem.lastVisitTime;
    }
  },
  addVisitItem : function(oVisitItem) {
    this._lVisitItems.push(oVisitItem);
    if (oVisitItem.lastVisitTime > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItem.lastVisitTime;
    }
  },
  // TODO: Remove the "get" from simple getters, add "compute" prefix to complex
  // ones.
  getStartPoint : function() {
    return this._lVisitItems[0];
  },
  getEndPoint : function() {
    return this._lVisitItems[lVisitItems.length - 1];
  },
  getMainPoint : function() {
  },
  getVisitItemPosition : function(sID) {
    for ( var i = 0; i < this.lVisitItems; i++) {
      if (this.lVisitItems[i].id === sID) {
        return i;
      }
    }
    return -1;
  },
  storySCAN : function() {
  },
  removeVisitItem : function(sID) {
    // TODO(rmoutard) : maybe use a temp trash
    this._lVisitItems = _.reject(this._lVisitItems, function(oVisitItem) {
      return oVisitItem.id === sID;
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
        * (this._fLastVisitTime / new Date().getTime()) + coeff.hostname
        * this.countUniqHostname() + coeff.search * this.countSearchPathname();

  },
  computeKeywords : function() {
    for ( var i = 0, oHistoryItem; oHistoryItem = this._lHistoryItems[i]; i++) {
      this._lKeywords = this._lKeywords.concat(oHistoryItem.extractedWords);
    }
  },
  merge : function(oHistoryItem) {
    this._lHistoryItems = this._lHsitoryItems.concat(oHistoryItem.iter());
    this._fLastVisitTime = Math.max(this._fLastVisitTime, oHistoryItem
        .lastVisitTime());
  },

});
