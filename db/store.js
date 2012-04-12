'use strict';

Cotton.DB.Store = function(sDatabaseName, dTranslators, mOnReadyCallback) {
  var self = this;

  this._dTranslators = dTranslators;

  var dIndexesForObjectStoreNames = {};
  // TODO: Use _.each everywhere instead of ugly for loops?
  _.each(dTranslators, function(lTranslators, sObjectStoreName) {
    dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(sObjectStoreName).indexDescriptions();
  });

  this._oEngine = new Cotton.DB.Engine(sDatabaseName, dIndexesForObjectStoreNames, function() {
    mOnReadyCallback.call(self);
  });
};

$.extend(Cotton.DB.Store.prototype, {

  // Must be called once the store is ready.
  list: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.list(sObjectStoreName, function(oResult) {
      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },
  
  listInverse: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.listInverse(sObjectStoreName, function(oResult) {
      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },
  
  getList: function(sObjectStoreName, mResultElementCallback){
    var self = this;

    this._oEngine.getList(sObjectStoreName, function(oResult) {
            var lList = new Array();
      for(var i = 0, oDbRecord; oDbRecord = oResult[i]; i++){
        var oTranslator = self._translatorForDbRecord(sObjectStoreName, oDbRecord);
        var oObject = oTranslator.dbRecordToObject(oDbRecord);
        lList.push(oObject);
      }
      mResultElementCallback.call(self, lList);
    });
  },

  getRange: function(sObjectStoreName, iLowerBound, iUpperBound, mResultElementCallback) {
    var self = this;

    this._oEngine.getRange(sObjectStoreName,
      iLowerBound, iUpperBound,
      function(oResult) {
      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },


  getLastEntry: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.getLastEntry(sObjectStoreName, function(oResult) {

      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },


  find: function(sObjectStoreName, sIndexKey, oIndexValue, mResultCallback) {
    var self = this;

    this._oEngine.find(sObjectStoreName, sIndexKey, oIndexValue, function(oResult) {
      if (!oResult) {
        // If there was no result, send back null.
        mResultCallback.call(self, null);
        return;
      }

      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultCallback.call(self, oObject);
    });
  },

  // Must be called once the store is ready.
  put: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;

    var oTranslator = this._translatorForObject(sObjectStoreName, oObject);
    var dDbRecord = oTranslator.objectToDbRecord(oObject);

    this._oEngine.put(sObjectStoreName, dDbRecord, function(iId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId);
      }
    });
  },

  delete: function(sObjectStoreName, oObject, mOnDeleteCallback) {
    var self = this;

    this._oEngine.delete(sObjectStoreName, oObject.id(), function() {
      if (mOnDeleteCallback) {
        mOnDeleteCallback.call(self);
      }
    });
  },

  _translatorForDbRecord: function(sObjectStoreName, dDbRecord) {
    return this._translator(sObjectStoreName, dDbRecord.sFormatVersion);
  },

  _translatorForObject: function(sObjectStoreName, oObject) {
    return this._lastTranslator(sObjectStoreName);
  },

  // Returns the translator matching the given type and format version. Throws
  // an exception if there is no
  // such translator.
  _translator: function(sObjectStoreName, sFormatVersion) {
    var lTranslators = this._dTranslators[sObjectStoreName];
    // TODO(fwouts): Store the translators as a hash using versions as keys?
    for (var iI = 0, oTranslator; oTranslator = lTranslators[iI]; iI++) {
      if (oTranslator.formatVersion() == sFormatVersion) {
        break;
      }
    }
    if (!oTranslator) {
      throw "No translator matching record version (" + sFormatVersion + " for type " + sObjectStoreName + ")."
    }
    return oTranslator;
  },

  // Returns the last translator for the given type. Throws an exception if the
  // type does not have any
  // translators.
  _lastTranslator: function(sObjectStoreName) {
    var lTranslators = this._dTranslators[sObjectStoreName];
    if (!lTranslators) {
      throw "Unknown type."
    }
    var oTranslator = lTranslators[lTranslators.length - 1];
    return oTranslator;
  }
});
