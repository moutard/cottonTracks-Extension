'use strict';

/**
 * Story
 *
 */
Cotton.Model.Story = Class.extend({

  _iId : null,

  _sTitle : null,
  _sFeaturedImage : null,

  _fLastVisitTime : null,
  _fRelevance : null,

  _lVisitItemsId : null,
  _lVisitItems : null,

  /**
   * @constructor
   */
  init : function() {

    this._fLastVisitTime = 0;

    this._sTitle = "";
    this._sFeaturedImage = "";
    this._lVisitItemsId = new Array();
    this._lVisitItems = new Array();
  },

  id : function() {
    return this._iId;
  },
  setId : function(iId) {
    this._iId = iId;
  },
  title : function() {
    return this._sTitle;
  },
  setTitle : function(sTitle) {
    this._sTitle = sTitle;
  },
  featuredImage : function() {
    return this._sFeaturedImage;
  },
  setFeaturedImage : function(sFeaturedImage) {
    this._sFeaturedImage = sFeaturedImage;
  },

  length : function() {
    return this._lVisitItems.length;
  },
  visitItems : function() {
    return this._lVisitItems;
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

  /**
   * Add a visitItem to the list parsing a dbRecordObject
   * - update list of visitItems id.
   * - update last visit time.
   *
   * @param {Object} oVisitItemDbRecord
   */
  addDbRecordVisitItem : function(oVisitItemDbRecord) {
    var self = this;
    if (_.indexOf(this._lVisitItemsId, oVisitItemDbRecord['id']) === -1) {
      this._lVisitItemsId.push(oVisitItemDbRecord['id']);
      // TODO(rmoutard) find a way to not use store.
      /*
      new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        var oTranslator = this._translatorForObject('visitItems',
                                                          oVisitItemDbRecord);
        var oVisitItem = oTranslator.dbRecordToObject(oVisitItemDbRecord,
                                                          oVisitItemDbRecord);
        self._lVisitItems.push(oVisitItem);
      });
      */

      if (oVisitItemDbRecord['iVisitTime'] > this._fLastVisitTime) {
        this._fLastVisitTime = oVisitItemDbRecord['iVisitTime'];
      }
    }
  },

  /**
   * Add a visitItem to the list.
   * - update list of visitItems id.
   * - update last visit time.
   *
   * @param {Cotton.UI.VisitItem} oVisitItem
   */
  addVisitItem : function(oVisitItem) {
    if (_.indexOf(this._lVisitItemsId, oVisitItem.id()) === -1) {
      this._lVisitItemsId.push(oVisitItem.id());
      this._lVisitItems.push(oVisitItem);
      if (oVisitItem.visitTime() > this._fLastVisitTime) {
        this._fLastVisitTime = oVisitItem.visitTime();
      }
    }
  },

  /**
   * Add an id to the list of visitItems id.
   * - check there is now duplicate id.
   *
   * @param {int} iVisitItemId
   */
  addVisitItemId : function(iVisitItemId) {
    if (_.indexOf(this._lVisitItemsId, iVisitItemId) === -1) {
      this._lVisitItemsId.push(iVisitItemId);
    }
  },

  /**
   * Replace the whole visit items list.
   *
   * @param {Array} lVisitItems
   */
  setVisitItems : function(lVisitItems) {
    this._lVisitItems = lVisitItems;
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

  computeVisitItems : function() {
    var self = this;
    new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      this.findGroup('visitItems', 'id', self.visitItemsId(), function(
          lVisitItems) {
        self.setVisitItems(lVisitItems);
      });

    });
  },

  /**
   * compute the title of the story. If a google search exists then return
   * associated keywords. If not most frequent keywords are not really pertinent
   * because the order is weird. So return the title of the first page.
   *
   * TODO(rmoutard) : give the title of the page that contains the more of the
   * most frequent keywords.
   */
  computeTitle : function() {
    /** We can't recompute the title if it already exists */
    if (this._lVisitItems.length !== 0) {
      var lKeywords = new Array();
      for ( var i = 0, oVisitItem; oVisitItem = this._lVisitItems[i]; i++) {
        lKeywords = lKeywords.concat(oVisitItem.extractedWords());
        if (oVisitItem.queryWords().length !== 0) {
          this._sTitle = oVisitItem.queryWords().join(" ");
          return;
        }
        this._sTitle = oVisitItem.extractedWords().slice(0, 5).join(" ");
      }

      /**
       * Most Frequent keywords. - All the keywords are in the array lKeywords -
       * Reject small keywords - Hard formula that gives the most frequent
       * keywords.
       */
      lKeywords = _.reject(lKeywords, function(s) {
        return s.length < 4;
      });

      var lMostFrequentKeywords = _.map(
          _.sortBy(_.values(_.groupBy(lKeywords, function(iI) {
            return iI;
          })), function(l) {
            return -l.length;
          }), function(l) {
            return l[0];
          }).slice(0, 3);
      // this._sTitle = lMostFrequentKeywords.join(" ");

      if (this._sTitle === "" | this._sTitle === undefined) {
        this._sTitle = this._lVisitItems[0].title();
      }
      return;
    } else {
      this._sTitle = 'Unknown22';
    }
  },

  computeFeaturedImage : function() {
    if (this._sFeaturedImage === "") {
      if (this._lVisitItems.length !== 0) {
        var reg = new RegExp(".(jpg|png|gif)$", "g");
        for ( var i = 0, oVisitItem; oVisitItem = this._lVisitItems[i]; i++) {
          if (reg.exec(oVisitItem.url())) {
            this._sFeaturedImage = oVisitItem.url();
            return;
          }
          if (oVisitItem.extractedDNA().imageUrl() !== "") {
            this._sFeaturedImage = oVisitItem.extractedDNA().imageUrl();
          }
        }
        // TODO(rmoutard) : Do best than that with most frequent keywords.

      }
    }
  },
});
