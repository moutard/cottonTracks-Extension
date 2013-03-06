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
   * @contructor
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
    var lResults = JSON.parse(this._oDb.getItem(this._getStoreLocation())) || [];

    if(lResults.length >= this._iMaxSize){
      // Pop the oldest element, it's always the first element of the list.
      // TODO(rmoutard) : check it's true.
      lResults.shift();
    }

    // There is still space.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
    lResults.push(dItem);
    this._oDb.setItem(this._getStoreLocation(), JSON.stringify(lResults));
  },

});

