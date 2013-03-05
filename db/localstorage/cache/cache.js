'use strict';

/**
 * Cache extend the localstorage but for each element add a time used and
 * a expiricy date. Each time a call is made to the cache it returns fresh data
 * and remove data that have expired.
 *
 */
Cotton.DB.Cache = Cotton.DB.LocalStorage.Engine.extend({

  /**
   * Time during the data is still fresh after is ceation.
   * in seconds.
   */
  _iExpiracy : Number.MAX_VALUE, // TODO(rmoutard) : never epires

  /**
   * @contructor
   * @param {String} sDatabaseName
   * @param {Dictionnary} dTranslators :
   *  key storename value : corresponding translators.
   * @param {Funtion} mOnReadyCallback:
   */
  init : function(sDatabaseName, dTranslators, mOnReadyCallback) {
    var self = this;
    this._super( 'ct-cache-' + sDatabaseName, dTranslators, mOnReadyCallback);
  },

  /**
   * Return everything in the cache, even if there is some expired data.
   * so we get a very fast method that can be used very often.
   *
   * If you want to be sure to have non expiredData use getFresh.
   */
  get : function(){
    var lResults = JSON.parse(this._oDb.getItem(this._sDatabaseName +
        "-" + sObjectStoreName));
    mResultElementCallback(lResults);
  },

  /**
   * Be sure to have non expired data.
   */
  getFresh : function(){
    var self = this;
    // We use string to avoid problem with too long int.
    var iCurrentDate = new Date().getTime().toString();
    var lFreshItems = _.filter(JSON.parse(localStorage.getItem(self._sDatabaseName)),
        function(oItem){
          return oItem['sExpiracyDate'] < iCurrentDate;
        });
    // as you computed fresh data, set the cache content.
    this._refresh(lFreshItems);
    return lFreshItems;
  },

  refresh : function (lFreshItems){
    var sCurrentDate = new Date().getTime().toString();
    var _lFreshItems = lFreshItems || _.filter(JSON.parse(localStorage.getItem(self._sDatabaseName)),
        function(oItem){
          return oItem['sExpiracyDate'] < sCurrentDate;
        });
    this._oDb.setItem(self._sDatabaseName, _lFreshItems);
  },

   put : function(sObjectStoreName, dItem, mOnSaveCallback) {
    var lResults = JSON.parse(this._oDb.getItem(this._sDatabaseName +
        "-" + sObjectStoreName)) || [];
    // We use string to avoid problem with too long int.
    dItem['sExpiracyDate'] = (new Date().getTime() + this._iExpiracy).toString();
    lResults.push(dItem);
    this._oDb.setItem(JSON.stringify(lResults));
    mOnSaveCallback();
  },

});
