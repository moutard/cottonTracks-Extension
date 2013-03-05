'use strict';

/**
 * Abstract layer that wrap a engine for a specific database.
 *
 * Whatever the format of the stored record in the database, the wrapper return
 * a javascript object with its methods corresponding to a model.
 */
Cotton.DB.WrapperForEngine = Class.extend({

  init : function(sDatabaseName, oTranslatorsCollection, oEngine) {
    var self = this;
    self._oTranslatorsCollection = oTranslatorsCollection;

    this._oEngine = oEngine;
  },

   empty : function(sObjectStoreName, mResultElementCallback){
     var self = this;

    this._oEngine.empty(sObjectStoreName, function(bIsEmpty){
       mResultElementCallback.call(self, bIsEmpty);
    });
  },

  // Must be called once the store is ready.
  iterList: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.iterList(sObjectStoreName, function(oResult) {
      var oObject = self._oTranslatorsCollection.dbRecordToObject(
        sObjectStoreName, oResult);
      mResultElementCallback.call(self, oObject);
    });
  },

  listInverse: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.listInverse(sObjectStoreName, function(oResult) {
      var oObject = self._oTranslatorsCollection.dbRecordToObject(
        sObjectStoreName, oResult);
      mResultElementCallback.call(self, oObject);
    });
  },

  getList: function(sObjectStoreName, mResultElementCallback){
    var self = this;

    this._oEngine.getList(sObjectStoreName, function(oResult) {
            var lList = new Array();
      for(var i = 0, oDbRecord; oDbRecord = oResult[i]; i++){
        var oObject = self._oTranslatorsCollection.dbRecordToObject(
          sObjectStoreName, oResult);
        lList.push(oObject);
      }
      mResultElementCallback.call(self, lList);
    });
  },

});
