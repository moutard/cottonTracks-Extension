'use strict';

/**
 * Cache extend the localstorage but for each element add a time used and
 * a expiricy date. Each time a call is made to the cache it returns fresh data
 * and remove data that have expired.
 *
 * Cache can also handle multiple store.
 * TODO(rmoutard): discuss if multiple store is usefull in cache context.
 *
 */
Cotton.DB.FixedSizeCache = Cotton.DB.SingleStoreCache.extend({

  /**
   * @param {String} sDatabaseName
   * @param {Dictionnary} dTranslators :
   *  key storename value : corresponding translators.
   * @param {Funtion} mOnReadyCallback:
   */
  init : function(sDatabaseName, iMaxSize, iExpiracy) {
    this._iMaxSize = iMaxSize;
    // call Single store cache.
    this._super(sDatabaseName, iExpiracy);
  },

  /**
   * Put an item in the cache.
   */
  put : function(dItem) {
    var lResults = this.get();

    if(lResults.length >= this._iMaxSize){
      // Pop the oldest element, it's always the first element of the list.
      // TODO(rmoutard) : check it's true.
      lResults.shift();
    }

    // There is still space.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
    lResults.push(dItem);
    this.set(lResults);
  },

  /**
   * Put an item in the cache with url uniqueness condition.
   */
  putUnique : function(dItem) {
    var lResults = this.get();
    var iLength = lResults.length;
    for (var i = 0; i < iLength; i++){
      var dPoolItem = lResults[i];
      if (dPoolItem['sUrl'] === dItem['sUrl']){
        lResults.splice(i,1);
        break;
      }
    }

    if(lResults.length >= this._iMaxSize){
      // Pop the oldest element, it's always the first element of the list.
      // TODO(rmoutard) : check it's true.
      lResults.shift();
    }

    // There is still space.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
    lResults.push(dItem);
    this.set(lResults);
  },

  /**
   * Force the cache to refresh it's data.
   */
  _refresh : function(lFreshItems) {
    var iCurrentDate = new Date().getTime();
    if(!lFreshItems){
      var _lFreshItems = this.get();
      // Perf: do not use native or underscore filter that are slow.
      lFreshItems = [];
      var iLength = _lFreshItems.length;
      for (var i = 0; i < iLength; i++) {
        var dFreshItem = _lFreshItems[i];
        if (iCurrentDate < dFreshItem['sExpiracyDate']) {
          lFreshItems.push(dFreshItem);
        }
      }
    } else if(lFreshItems.length > this._iMaxSize){
      lFreshItems = lFreshItems.slice(0, this._iMaxSize - 1);
    }
    this.set(lFreshItems);
  }
});

