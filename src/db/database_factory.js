'use strict';

Cotton.DB.DatabaseFactory = Class.extend({

  _lDatabaseTypesAvailable : null,

  init : function() {
    this._lDatabaseTypesAvailable = ['indexeddb', 'localstorage'];
  },

  getCache : function(sCacheName) {
    // is there is already a cache with this name, fill the cache with the old cache value.
    var lCacheStore = JSON.parse(localStorage.getItem('ct-cache-' + sCacheName + '-store'));
    if (lCacheStore && lCacheStore !== []) {
      var oCache = new Cotton.DB.FixedSizeCache(sCacheName, 50);
      oCache.set(lCacheStore);
      return oCache;
    } else {

      // Create engine using translator collection for indexes.
      var oCache = new Cotton.DB.FixedSizeCache(sCacheName, 50);
      // As dbscan2 work directly on dDbRecord and not on the element, we don't
      // need a wrapper here.
      return oCache;
    }
  }

  // TODO(rmoutard): add a function to get the main database using models.
});
