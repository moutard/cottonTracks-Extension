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
    return this._lVisitItemsId;
  },
  visitItemsId : function() {
    return this._lVisitItemsId;
  },
  lastVisitTime : function() {
    return this._fLastVisitTime;
  },
  setLastVisitTime : function(fLastVisitTime) {
    this._fLastVisitTime = fLastVisitTime;
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
    // DEPRECATED.
    this._lHistoryItems.push(oHistoryItem);
    if (oVisitItem.lastVisitTime() > this._fLastVisitTime) {
      this._fLastVisitTime = oHistoryItem.lastVisitTime();
    }
  },
  addVisitItem : function(oVisitItem) {
    this._lVisitItemsId.push(oVisitItem._sId);
    if (oVisitItem._iVisitTime > this._fLastVisitTime) {
      this._fLastVisitTime = oVisitItem._iVisitTime;
    }
  },
  addVisitItemId : function(iVisitItemId) {
    this._lVisitItemsId.push(iVisitItemId);

    // Get the corresponding visitTime.
    /*
     * var oStore = new Cotton.DB.Store('ct', { 'visitItems' :
     * Cotton.Translators.VISIT_ITEM_TRANSLATORS }, function() {
     * oStore.find('visitItems', 'id', iVisitItemId, function(oVisitItem) {
     * console.log(oVisitItem); if (oVisitItem._iVisitTime >
     * this._fLastVisitTime) { this._fLastVisitTime = oVisitItem._iVisitTime; }
     * }); } );
     */
  },

  // TODO: Remove the "get" from simple getters, add "compute" prefix to complex
  // ones.
  getLastVisitItemId : function() {
    return _.max(this._lVisitItemsId);
  },
  getStartPoint : function() {
    return this._lVisitItemsId[0];
  },
  getEndPoint : function() {
    return this._lVisitItemsId[lVisitItems.length - 1];
  },
  getMainPoint : function() {
  },
  getVisitItemPosition : function(sID) {
    for ( var i = 0; i < this.lVisitItemsId; i++) {
      if (this.lVisitItems[i] === sID) {
        return i;
      }
    }
    return -1;
  },
  storySCAN : function() {
  },
  removeVisitItem : function(sID) {
    // TODO(rmoutard) : maybe use a temp trash
    this._lVisitItemsId = _.reject(this._lVisitItemsId, function(iVisitItemId) {
      return iVisitItemId === sID;
    });
  },
  moveHistoryItem : function(sIDtoMove, sIDPrevious) {
    // DEPRECATED.
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
    // DEPRECATED.
    var lTemp = _.filter(this._lHistoryItems, function(oHistoryItem) {
      // TODO(rmoutard) : not really a clean solution.
      // see pretreatment
      return oHistoryItem.pathname === "/search";
    });
    return lTemp.length;
  },
  countUniqHostname : function() {
    // DEPRECATED.
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
        * (this._fLastVisitTime / new Date().getTime())
    // TODO(rmoutard) : find a way to retore it.
    // + coeff.hostname * this.countUniqHostname()
    // + coeff.search * this.countSearchPathname();
    ;
  },
  computeKeywords : function() {
    // DEPRECATED.
    for ( var i = 0, oHistoryItem; oHistoryItem = this._lHistoryItems[i]; i++) {
      this._lKeywords = this._lKeywords.concat(oHistoryItem.extractedWords);
    }
  },
  merge : function(oStory) {
    this._lVisitItemsId = _.union(this._lVisitItemsId, oStory.iter());
    this._fLastVisitTime = Math.max(this._fLastVisitTime, oStory
        .lastVisitTime());
  },

});
