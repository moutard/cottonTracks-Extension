'use strict';

/**
 * An abstraction for the underlying LocalStorage API.
 *
 * EngineLocalstorage should not be used directly. It should be accessed through
 * more abstract layers like a Wrapper which hide its inner workings.
 *
 */
Cotton.DB.LocalStorage.Engine = Class.extend({

   /**
	* @param {String} sDatabaseName :
	*  the name of the database we want to use (it will be created
	*  if necessary).
	* @param {Dictionnary} dIndexesForObjectStoreNames :
	*  a dictionary where keys are the names of object stores we need to use (they
	*  will be created if necessary) and values are the dictionary of index
	*  properties for each object store.
	* @param {Function} mOnReadyCallback :
	*  the callback method that should be
	*  executed when the database is ready.
	*/
  init :function(sDatabaseName, dIndexesForObjectStoreNames) {
    var self = this;

    this._sDatabaseName = sDatabaseName;

    // Dict that contains all the stores, and for each store, the corresponding
    // indexes.
    this._dIndexesForObjectStoreNames = dIndexesForObjectStoreNames;

    // localStorage is the object allowing to communicate with browser storage.
    this._oDb = localStorage;

    // Set a flag to show that the database is up.
    this._oDb.setItem(sDatabaseName, 'True');
    for( var sStoreName in dIndexesForObjectStoreNames){
      // Init each store.
      this._oDb.setItem(this._getStoreLocation(sStoreName), JSON.stringify([]));
    }

  },

  _getStoreLocation : function(sStoreName) {
    return this._sDatabaseName + '-' + sStoreName;
  },

  //FIXME(rmoutard): use a callback method so the wrapper can be the same for
  //synchronous and asynchronous call.
  empty : function() {
    return this._oDb.getItem(this._sDatabaseName) === null ;
  },

  getList : function(sObjectStoreName) {
    var lResults = JSON.parse(this._oDb.getItem(
          this._getStoreLocation(sObjectStoreName)));
    if( lResults === null) throw "LocalStorage.Engine the store doesn't exit."
    return lResults;
  },

  find : function() {

  },

  findGroup : function() {

  },

  put : function(sObjectStoreName, dItem) {
    var self = this;
    var lResults = self.getList(sObjectStoreName);
    lResults.push(dItem);
    self._oDb.setItem(self._getStoreLocation(sObjectStoreName), JSON.stringify(lResults));
  },

  /**
   * Put a item in the cache with sKey uniqueness.
   * 
   * @param {String} sObjectStoreName:
   *          name of the object store.
   * @param {Dictionnary} dItem:
   *         element you want to add.
   * @param {String} sKey:
   *         key that should be unique.
   * @param {Function} mMerge:
   *         method that merge to dbRecords and return the merged dbRecord.		
   */
  putUnique : function(sObjectStoreName, dItem, sKey, mMerge) {
    var self = this;
    var lResults = self.getList(sObjectStoreName);
    var iLength = lResults.length;
    for (var i = 0; i < iLength; i++) {
      var dLocalstorageItem = lResults[i];
      if (dLocalstorageItem[sKey] === dItem[sKey]) {
        lResults[i] =  mMerge(dItem, lResults[i]);
        break;
      }
    }
    self._oDb.setItem(self._getStoreLocation(sObjectStoreName), JSON.stringify(lResults));
  },

  delete : function() {

  },

  purge : function() {
    var self = this;
    self._oDb.removeItem(self._sDatabaseName);
    _.each(self._dIndexesForObjectStoreNames,
        function(dStoreIndexes, sStoreName){
          self._oDb.removeItem(self._getStoreLocation(sStoreName));
    });
  },
});

