'use strict';

/**
 * Absract layer for Cotton.DB.EngineLocalStorage.
 *
 * NEVER USED FOR THE MOMENT.
 *
 */
Cotton.DB.LocalStorage.Wrapper = Class.extend({

  init : function(sDatabaseName, dModels, mOnReadyCallback) {
    var self = this;
    self._dTranslators = dModels;

    var dIndexesForObjectStoreNames = {};
    _.each(dModels, function(oModelClass, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = oModelClass.prototype._dModelIndexes;
    });

    var oEngine = new Cotton.DB.LocalStorage.Engine(
        sDatabaseName,
        dIndexesForObjectStoreNames,
        function() {
          mOnReadyCallback.call(self);
    });

    this._oEngine = oEngine;

  },
  empty : function() {
    this._oEngine.empty();
  },

  iterList : function(sObjectStoreName, mResultElementCallback) {
    this._oEngine.iterList(sObjectStoreName, mResultElementCallback)
  },

  getList : function(sObjectStoreName, mResultElementCallback) {
    this._oEngine.getList(sObjectStoreName, mResultElementCallback);
  },

  iterRange : function(sObjectStoreName, mResultElementCallback) {

  },

  getRange : function(sObjectStoreName, mResultElementCallback) {

  },

  find : function() {

  },

  findGroup : function() {

  },

  put : function(sObjectStoreName, oObject, mOnSaveCallback) {

    this._oEngine.put(sObjectStoreName, dItem, mOnSaveCallback);
  },

  putUnique : function(sObjectStoreName, oObject, mOnSaveCallback) {

    this._oEngine.putUnique(sObjectStoreName, dItem, mOnSaveCallback);
  },

  delete : function() {

  },

  purge : function() {
    this._oDB.removeItem(this._sDatabaseName);
    // TODO(rmoutard): remove all the stores.

  },
});

