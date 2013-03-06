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
   * @contructor
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

  _getStoreLocation : function() {
    return this._sDatabaseName + '-' + 'store';
  },

  /**
   * Return everything in the cache, even if there is some expired data.
   * so we get a very fast method that can be used very often.
   *
   * If you want to be sure to have non expiredData use getFresh.
   */
  get : function(){
    var lResults = JSON.parse(this._oDb.getItem(this._getStoreLocation()));
    return lResults;
  },

  /**
   * Be sure to have non expired data.
   */
  getFresh : function(){
    var self = this;
    var iCurrentDate = new Date().getTime();
    var lFreshItems = _.filter(JSON.parse(localStorage.getItem(
            this._getStoreLocation())),
        function(oItem){
          return oItem['sExpiracyDate'] < iCurrentDate;
        });
    // as you computed fresh data, set the cache content.
    this._refresh(lFreshItems);
    return lFreshItems;
  },

  /**
   * Force the cache to refresh it's data.
   */
  refresh : function (lFreshItems){
    var self = this;
    var sCurrentDate = new Date().getTime();
    var _lFreshItems = lFreshItems || _.filter(JSON.parse(
          localStorage.getItem(this._getStoreLocation())),
        function(oItem){
          return oItem['sExpiracyDate'] < sCurrentDate;
        });
    self._oDb.setItem(this._getStoreLocation(), _lFreshItems);
  },

  /**
   * Put an item in the cache.
   */
  put : function(dItem) {
    var lResults = JSON.parse(this._oDb.getItem(this._getStoreLocation())) || [];
    // We could use string to avoid problem with too long int but here it's
    // not a problem here because date are less that 10^53.
    dItem['sExpiracyDate'] = new Date().getTime() + this._iExpiracy;
    lResults.push(dItem);
    this._oDb.setItem(this._getStoreLocation(), JSON.stringify(lResults));
  },

});

