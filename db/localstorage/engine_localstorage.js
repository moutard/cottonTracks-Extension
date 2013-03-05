'use strict';

/**
 * An abstraction for the underlying LocalStorage API.
 *
 * EngineIndexedDB should not be used directly. It should be accessed through
 * more abstract layers like a Wrapper which hide its inner workings.
 *
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
Cotton.DB.LocalStorage.Engine = Class.extend({

  init :function(sDatabaseName, dIndexesForObjectStoreNames, mOnReadyCallback) {
    var self = this;

    this._sDatabaseName = sDatabaseName;
    this._oDb = localStorage;
    this._oDB.putItem(sDatabaseName) = 'True';

    //TODO(rmoutard) : add variable that knows all the store in the database.
  },

  empty : function() {
    return this._oDB.getItem(this._sDatabaseName) === null ;
  },

  iterList : function(sObjectStoreName, mResultElementCallback) {
    var lResults = JSON.parse(this._oDB.getItem(this._sDatabaseName +
        "-" + sObjectStoreName));
    for(var i = 0; i < lResults.length; i++){
      mResultElementCallback(lResults[i]);
    }
  },

  getList : function(sObjectStoreName, mResultElementCallback) {
    var lResults = JSON.parse(this._oDB.getItem(this._sDatabaseName +
        "-" + sObjectStoreName));
    mResultElementCallback(lResults);
  },

  iterRange : function(sObjectStoreName, mResultElementCallback) {

  },

  getRange : function(sObjectStoreName, mResultElementCallback) {

  },

  find : function() {

  },

  findGroup : function() {

  },

  put : function(sObjectStoreName, dItem, mOnSaveCallback) {
    var lResults = JSON.parse(this._oDB.getItem(this._sDatabaseName +
        "-" + sObjectStoreName)) || [];
    lResults.push(dItem);
    this._oDB.setItem(JSON.stringify(lResults));
    mOnSaveCallback();
  },

  delete : function() {

  },

  purge : function() {
    this._oDB.removeItem(this._sDatabaseName);
    // TODO(rmoutard): remove all the stores.

  },
});

