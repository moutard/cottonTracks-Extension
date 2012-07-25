'use strict';

Cotton.DB.Store = Class.extend({

  init : function(sDatabaseName, dTranslators, mOnReadyCallback) {
    var self = this;
    console.debug('New store');
    this._dTranslators = dTranslators;

    var dIndexesForObjectStoreNames = {};
    // TODO: Use _.each everywhere instead of ugly for loops?
    _.each(dTranslators, function(lTranslators, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(sObjectStoreName).indexDescriptions();
    });

    this._oEngine = new Cotton.DB.Engine(
        sDatabaseName,
        dIndexesForObjectStoreNames,
        function() {
          mOnReadyCallback.call(self);
    });
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
        var oTranslator = self._translatorForDbRecord(sObjectStoreName,
                                                      oDbRecord);
        var oObject = oTranslator.dbRecordToObject(oDbRecord);
        lList.push(oObject);
      }
      mResultElementCallback.call(self, lList);
    });
  },

  iterRange: function(sObjectStoreName, iLowerBound, iUpperBound,
                        mResultElementCallback) {
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


  getUpperBound: function(sObjectStoreName, sIndexKey, iUpperBound,
                            iDirection, bStrict,
                            mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getUpperBound(
      sObjectStoreName, sIndexKey, iUpperBound, iDirection, bStrict,
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

  getLowerBound: function(sObjectStoreName, sIndexKey, iLowerBound,
                            iDirection, bStrict,
                            mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getLowerBound(
      sObjectStoreName, sIndexKey, iLowerBound, iDirection, bStrict,
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

  getBound: function(sObjectStoreName, sIndexKey,
                      iLowerBound, lUpperBound, iDirection,
                      bStrictLower, bStrictUpper,
                      mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getBound(
      sObjectStoreName, sIndexKey, iLowerBound, iUpperBound, iDirection,
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

  getLast: function(sObjectStoreName, sIndexKey, mResultElementCallback) {
    var self = this;

    this._oEngine.getLast(sObjectStoreName, sIndexKey, function(oResult) {

      var oTranslator = self._translatorForDbRecord(sObjectStoreName, oResult);
      var oObject = oTranslator.dbRecordToObject(oResult);
      mResultElementCallback.call(self, oObject);
    });
  },

  getXItems: function(sObjectStoreName, iX, sIndexKey, iDirection,
      mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getXItems(
        sObjectStoreName, iX, sIndexKey, iDirection,
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

  getXYItems: function(sObjectStoreName, iX, iY, sIndexKey, iDirection,
      mResultElementCallback) {
    var self = this;

    var lAllObjects = new Array();
    this._oEngine.getXYItems(
        sObjectStoreName, iX, iY, sIndexKey, iDirection,
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

  find: function(sObjectStoreName, sIndexKey, oIndexValue,
                  mResultElementCallback) {
    var self = this;

    this._oEngine.find(sObjectStoreName, sIndexKey, oIndexValue,
      function(oResult) {
        if (!oResult) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, null);
          return;
        }

        var oTranslator = self._translatorForDbRecord(sObjectStoreName,
                                                      oResult);
        var oObject = oTranslator.dbRecordToObject(oResult);
        mResultElementCallback.call(self, oObject);
    });
  },

  findGroup: function(sObjectStoreName, sIndexKey, lIndexValue,
                        mResultElementCallback) {
    var self = this;
    var lAllObjects = new Array();

    this._oEngine.findGroup(sObjectStoreName, sIndexKey, lIndexValue,
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

  add: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;

    var oTranslator = this._translatorForObject(sObjectStoreName, oObject);
    var dDbRecord = oTranslator.objectToDbRecord(oObject);

    this._oEngine.add(sObjectStoreName, dDbRecord, function(iId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId);
      }
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

  putList: function(sObjectStoreName, lObjects, mOnSaveCallback) {
    var self = this;

    var lAllItems = new Array();
    for(var i = 0, oObject; oObject = lObjects[i]; i++ ){
      var oTranslator = self._translatorForObject(sObjectStoreName, oObject);
      var dDbRecord = oTranslator.objectToDbRecord(oObject);
      lAllItems.push(dDbRecord);
    }
    // console.debug('putList After translate');
    // console.debug(lAllItems);
    this._oEngine.AputList(sObjectStoreName, lAllItems, function(lAllId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, lAllId);
      }
    });
  },

  update: function(sObjectStoreName, sId, oObject, mOnSaveCallback) {
    var self = this;

    var oTranslator = this._translatorForObject(sObjectStoreName, oObject);
    var dDbRecord = oTranslator.objectToDbRecord(oObject);

    this._oEngine.update(sObjectStoreName, sId, dDbRecord, function(iId) {
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

  purge: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.purge(sObjectStoreName, function() {
      mResultElementCallback.call(self);
    });
  },

  _translatorForDbRecord: function(sObjectStoreName, dDbRecord) {
    return this._translator(sObjectStoreName, dDbRecord['sFormatVersion']);
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
