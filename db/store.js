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
  iterList: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.iterList(sObjectStoreName, function(oResult) {
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

  iterRange: function(sObjectStoreName, iLowerBound, iUpperBound, mResultElementCallback) {
    var self = this;

    this._oEngine.iterRange(sObjectStoreName,
      iLowerBound, iUpperBound,
      function(oResult) {
      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },

  getRange: function(sObjectStoreName, iLowerBound, iUpperBound,
                      mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getRange(sObjectStoreName,
      iLowerBound, iUpperBound,
      function(oResult) {
        if (!oResult) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, lAllObjects);
          return;
        }
        // else oResult is a list of Items.
        for(var i = 0, oItem; oItem = oResult[i]; i++ ){
          var oTranslator = self._translatorForDbRecord(sObjectStoreName,
          oItem);
          var oObject = oTranslator.dbRecordToObject(oItem);
          lAllObjects.push(oObject);
        }
  
        mResultElementCallback.call(self, lAllObjects);
    });
  },
  
  getUpperBound: function(sObjectStoreName, iUpperBound, iDirection, bStrict,
                            mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getUpperBound(
      sObjectStoreName, iUpperBound, iDirection, bStrict,
      function(oResult) {
        if (!oResult) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, lAllObjects);
          return;
        }
        // else oResult is a list of Items.
        for(var i = 0, oItem; oItem = oResult[i]; i++ ){
          var oTranslator = self._translatorForDbRecord(sObjectStoreName,
          oItem);
          var oObject = oTranslator.dbRecordToObject(oItem);
          lAllObjects.push(oObject);
        }
  
        mResultElementCallback.call(self, lAllObjects);
    });
  },
  
  getLowerBound: function(sObjectStoreName, iLowerBound, iDirection, bStrict,
                            mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getLowerBound(
      sObjectStoreName, iLowerBound, iDirection, bStrict,
      function(oResult) {
        if (!oResult) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, lAllObjects);
          return;
        }
        // else oResult is a list of Items.
        for(var i = 0, oItem; oItem = oResult[i]; i++ ){
          var oTranslator = self._translatorForDbRecord(sObjectStoreName,
          oItem);
          var oObject = oTranslator.dbRecordToObject(oItem);
          lAllObjects.push(oObject);
        }
  
        mResultElementCallback.call(self, lAllObjects);
    });
  },
  
  getBound: function(sObjectStoreName, iLowerBound, lUpperBound, iDirection, 
                      bStrictLower, bStrictUpper,
                      mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getBound(
      sObjectStoreName, iLowerBound, iUpperBound, iDirection, 
      bStrictLower, bStrictUpper,
      function(oResult) {
        if (!oResult) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, lAllObjects);
          return;
        }
        // else oResult is a list of Items.
        for(var i = 0, oItem; oItem = oResult[i]; i++ ){
          var oTranslator = self._translatorForDbRecord(sObjectStoreName,
          oItem);
          var oObject = oTranslator.dbRecordToObject(oItem);
          lAllObjects.push(oObject);
        }
  
        mResultElementCallback.call(self, lAllObjects);
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


  find: function(sObjectStoreName, sIndexKey, oIndexValue, mResultElementCallback) {
    var self = this;

    this._oEngine.find(sObjectStoreName, sIndexKey, oIndexValue, function(oResult) {
      if (!oResult) {
        // If there was no result, send back null.
        mResultElementCallback.call(self, null);
        return;
      }

      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },
  
  findGroup: function(sObjectStoreName, sIndexKey, lIndexValue, mResultElementCallback) {
    var self = this;
    var lAllObjects = new Array();
    this._oEngine.findGroup(sObjectStoreName, sIndexKey, lIndexValue, function(oResult) {
      if (!oResult) {
        // If there was no result, send back null.
        mResultElementCallback.call(self, lAllObjects);
        return;
      }
      // else oResult is a list of Items.
      for(var i = 0, oItem; oItem = oResult[i]; i++ ){
        var oTranslator = self._translatorForDbRecord(sObjectStoreName,
        oItem);
        var oObject = oTranslator.dbRecordToObject(oItem);
        lAllObjects.push(oObject);
      }

      mResultElementCallback.call(self, lAllObjects);
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

  delete: function(sObjectStoreName, iId, mOnDeleteCallback) {
    var self = this;

    this._oEngine.delete(sObjectStoreName, iId, function() {
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
