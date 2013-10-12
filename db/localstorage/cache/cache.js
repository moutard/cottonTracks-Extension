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
Cotton.DB.Cache = Cotton.DB.LocalStorage.Engine.extend({

  /**
   * Time during the data is still fresh after is ceation.
   * in seconds.
   */
  _iExpiracy : null, // TODO(rmoutard) : never expires

  /**
   * @param {String} sDatabaseName
   * @param {Dictionnary} dTranslators :
   *  key storename value : corresponding translators.
   * @param {Funtion} mOnReadyCallback:
   */
  init : function(sDatabaseName, dIndexesForObjectStoreNames, iExpiracy) {
    this._iExpiracy = iExpiracy || 0;
    //FIXME(rmoutard): do we need store descriptors.
    this._super('ct-cache-' + sDatabaseName, dIndexesForObjectStoreNames);
  },

  /**
   * Return everything in the cache, even if there is some expired data.
   * so we get a very fast method that can be used very often.
   *
   * If you want to be sure to have non expiredData use getFresh.
   */
  getStore : function(sObjectStoreName){
    return JSON.parse(this._oDb.getItem(
          this._getStoreLocation(sObjectStoreName))) || [];
  },

  setStore : function(sObjectStoreName, lItems){
    this._oDb.setItem(this._getStoreLocation(sObjectStoreName),
        JSON.stringify(lItems));
  },

  /**
   * Return true if a item is fresh.
   */
  _isFresh : function(oItem){
    var iCurrentDate = new Date().getTime();
    return iCurrentDate < oItem['sExpiracyDate'];
  },
  /**
   * Be sure to have non expired data.
   */
  getFresh : function(sObjectStoreName){
    var iCurrentDate = new Date().getTime();
    var lItems = this.getStore(sObjectStoreName);

    // Perf: do not use native or underscore filter that are slow.
    var lFreshItems = [];
    var iLength = lItems.length;
    for (var i = 0; i < iLength; i++) {
      if(iCurrentDate < lItems[i]['sExpiracyDate']){
        lFreshItems.push(lItems[i]);
      }
    }

    // as you computed fresh data, set the cache content.
    this._refresh(sObjectStoreName, lFreshItems);
    return lFreshItems;
  },

  /**
   * Force the cache to refresh it's data.
   * Becarefull it's a private method you can't use it, there are no security
   * guards so the method is faster, but so you can overide expiracy date
   * inside the cache, and bring dangerous behaviour.
   */
  _refresh : function (sObjectStoreName, lFreshItems){
    var iCurrentDate = new Date().getTime();
    if(!lFreshItems){
      var _lFreshItems = this.getStore(sObjectStoreName);
      // Perf: do not use native or underscore filter that are slow.
      lFreshItems = [];
      var iLength = _lFreshItems.length;
      for (var i = 0; i < iLength; i++) {
        if (iCurrentDate < _lFreshItems[i]['sExpiracyDate']) {
          lFreshItems.push(_lFreshItems[i]);
        }
      }
    }
    this.setStore(sObjectStoreName, lFreshItems);
  },

  /**
   * Put an item in the cache.
   */
  put : function(sObjectStoreName, dItem) {
    var lResults = this.getStore(sObjectStoreName);
    // We could use string to avoid problem with too long int but here it's
    // not a problem here because date are less that 10^53.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;

    lResults.push(dItem);
    this.setStore(sObjectStoreName, lResults);
  },

});
