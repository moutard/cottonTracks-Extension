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
Cotton.DB.SingleStoreCache = Cotton.DB.LocalStorage.Engine.extend({

  /**
   * @param {String} sDatabaseName
   * @param {Dictionnary} dTranslators :
   *  key storename value : corresponding translators.
   * @param {Funtion} mOnReadyCallback:
   */
  init : function(sDatabaseName, iExpiracy) {
    this._iExpiracy = iExpiracy || 0;
    // Add a unique store.
    this._super('ct-cache-' + sDatabaseName, {'store':{}});
  },

  /**
   * Return the store location.
   * TODO(rmoutard): evaluate if it's better for speed to use a variable,
   * instead of a function maybe the switch is longuer.
   */
  _getStoreLocation : function() {
    return this._sDatabaseName + '-' + 'store';
  },

  /**
   * Return everything in the cache, even if there is some expired data.
   * so we get a very fast method that can be used very often.
   *
   * If you want to be sure to have non expiredData use getFresh.
   */
  get : function() {
    return JSON.parse(this._oDb.getItem(this._getStoreLocation())) || [];
  },

  // TODO(rmoutard): evaluate if it's better for speed to use a variable,
  set : function(lItems) {
    this._oDb.setItem(this._getStoreLocation(), JSON.stringify(lItems));
  },

  /**
   * Be sure to have non expired data.
   */
  getFresh : function(){
    var iCurrentDate = new Date().getTime();
    var lItems = this.get();

    // Perf: do not use native or underscore filter that are slow.
    var lFreshItems = [];
    var iLength = lItems.length;
    for (var i = 0; i < iLength; i++) {
      var dItem = lItems[i];
      if (iCurrentDate < dItem['sExpiracyDate']) {
        lFreshItems.push(dItem);
      }
    }

    // as you computed fresh data, set the cache content.
    this._refresh(lFreshItems);
    return lFreshItems;

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
        var dItem = _lFreshItems[i];
        if(iCurrentDate < dItem['sExpiracyDate']){
          lFreshItems.push(dItem);
        }
      }
    }
    this.set(lFreshItems);
  },

  /**
   * Put an item in the cache.
   */
  put : function(dItem) {
    var lResults = this.get();
    // We could use string to avoid problem with too long int but here it's
    // not a problem here because date are less that 10^53.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
    lResults.push(dItem);
    this.set(lResults);
  },

  /**
   * Put a item in the cache with sKey uniqueness.
   *
   * @param {Dictionnary} dItem:
   *         element you want to add.
   * @param {String} sKey:
   *         key that should be unique.
   * @param {Function} mMerge:
   *         method that merge to dbRecords and return the merged dbRecord.
   */
  putUnique : function(dItem, sKey, mMerge) {
    var lResults = this.get();
    var iLength = lResults.length;
    for (var i = 0; i < iLength; i++) {
      var dPoolItem = lResults[i];
      if (dPoolItem[sKey] === dItem[sKey]){
    	lResults[i] =  mMerge(dItem, lResults[i]);
        // We could use string to avoid problem with too long int but here it's
        // not a problem here because date are less that 10^53.
    	lResults[i]['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
      var bMerge = true;
        break;
      }
    }
    if (!bMerge) {
      dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
      lResults.push(dItem);
    }
    this.set(lResults);
  },

  /**
   * Put an item in the cache.
   */
  delete : function(iId) {
    var lResults = this.get();
    var iLength = lResults.length;
    for (var i = 0; i < iLength; i++){
      var dPoolItem = lResults[i];
      if (dPoolItem['id'] === iId){
        lResults.splice(i,1);
        break;
      }
    }
    this.set(lResults);
  }

});

