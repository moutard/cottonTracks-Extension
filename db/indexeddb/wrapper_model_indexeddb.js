/**
 * Absract layer for Cotton.DB.EngineIndexedDB.
 *
 */
Cotton.DB.IndexedDB.WrapperModel = Class.extend({

  init : function(sDatabaseName, dModels, mOnReadyCallback) {
    var self = this;
    self._sDatabaseName = sDatabaseName;
    self._dModels = dModels;

    var dIndexesForObjectStoreNames = {};
    _.each(dModels, function(oModelClass, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = oModelClass.prototype._dModelIndexes;
      console.log(dIndexesForObjectStoreNames);
    });

    this._oEngine = new Cotton.DB.IndexedDB.Engine(sDatabaseName,
        dIndexesForObjectStoreNames,
        function() {
          mOnReadyCallback.call(self);
    });

  },

  /**
   * Given a dDBRecord return an javascript object that corresponds to the
   * right class.
   * @param {String} sObjectStoreName: name of the store.
   * @param {Dictionnary} dDbRecord: record stored in the database and
   * return by the engine.
   * @return {Cotton.Model}
   */
  _dbRecordToObject: function(sObjectStoreName, dDbRecord) {
    return new this._dModels[sObjectStoreName](dDbRecord);
  },

  /**
   * Given an object return a dbRecord.
   * @param {String} sObjectStoreName:
   * @param {Cotton.Model} : oObject
   */
  _objectToDBRecord: function(sObjectStoreName, oObject) {
    return oObject.dbRecord();
  },

  empty : function(sObjectStoreName, mResultElementCallback){
     var self = this;

    this._oEngine.empty(sObjectStoreName, function(bIsEmpty){
       mResultElementCallback.call(self, bIsEmpty);
    });
  },

  iterList: function(sObjectStoreName, mResultElementCallback) {
    var self = this;
    this._oEngine.iterList(sObjectStoreName, function(oDBRecord) {
      var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
      mResultElementCallback.call(self, oObject);
    });
  },


  listInverse: function(sObjectStoreName, mResultElementCallback) {
    var self = this;
    this._oEngine.listInverse(sObjectStoreName, function(oDBRecord) {
      var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
      mResultElementCallback.call(self, oObject);
    });
  },

  getList: function(sObjectStoreName, mResultElementCallback){
    var self = this;

    this._oEngine.getList(sObjectStoreName, function(oResult) {
      var lList = new Array();
      for(var i = 0, oDbRecord; oDbRecord = oResult[i]; i++){
        var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
        lList.push(oObject);
      }
      mResultElementCallback.call(self, lList);
    });
  },

  iterRange: function(sObjectStoreName, iLowerBound, iUpperBound,
                        mResultElementCallback) {
    var self = this;
    this._oEngine.iterRange(sObjectStoreName,
      iLowerBound, iUpperBound, function(oDBRecord) {
      var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
        for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
        for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
        for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
        for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
          lAllObjects.push(oObject);
        }

        mResultElementCallback.call(self, lAllObjects);
    });
  },

  getLastEntry: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    this._oEngine.getLastEntry(sObjectStoreName, function(oDBRecord) {
      var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
      mResultElementCallback.call(self, oObject);
    });
  },

  getLast: function(sObjectStoreName, sIndexKey, mResultElementCallback) {
    var self = this;

    this._oEngine.getLast(sObjectStoreName, sIndexKey, function(oDBRecord) {
      var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
          for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
            var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
          for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
            var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
            lAllObjects.push(oObject);
          }

          mResultElementCallback.call(self, lAllObjects);
        });
  },

  find: function(sObjectStoreName, sIndexKey, oIndexValue,
                  mResultElementCallback) {
    var self = this;

    this._oEngine.find(sObjectStoreName, sIndexKey, oIndexValue,
      function(oDBRecord) {
        if (!oDBRecord) {
          // If there was no result, send back null.
          mResultElementCallback.call(self, null);
          return;
        }

        var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
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
        for(var i = 0, oDBRecord; oDBRecord = oResult[i]; i++ ){
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
          lAllObjects.push(oObject);
      }

      mResultElementCallback.call(self, lAllObjects);
    });
  },

  search: function(sObjectStoreName, sIndexKey, oIndexValue,
                  mResultElementCallback) {
    var self = this;
    var lObjects = [];

    this._oEngine.search(sObjectStoreName, sIndexKey, oIndexValue,
      function(lResults) {
        for (var i = 0, iLength = lResults.length; i < iLength; i++) {
          var oDBRecord = lResults[i];
          var oObject = self._dbRecordToObject(sObjectStoreName, oDBRecord);
          lObjects.push(oObject);
        }

        mResultElementCallback.call(self, lObjects);
    });
  },

  put: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;

    var dDbRecord = self._objectToDBRecord(sObjectStoreName, oObject);
    this._oEngine.put(sObjectStoreName, dDbRecord, function(iId) {

      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId, oObject);
      }
    });
  },

  putList: function(sObjectStoreName, lObjects, mOnSaveCallback) {
    var self = this;

    var lAllItems = new Array();
    for(var i = 0, oObject; oObject = lObjects[i]; i++ ){
      var dDbRecord = self._objectToDBRecord(sObjectStoreName, oObject);
      lAllItems.push(dDbRecord);
    }

    this._oEngine.putList(sObjectStoreName, lAllItems, function(lAllId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, lAllId);
      }
    });
  },

  /**
   * If there is a error due to a unique key that is already in the database,
   * merge both the one you want to add and the one that already exists.
   */
  putUnique: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;
    var dDbRecord = self._objectToDBRecord(sObjectStoreName, oObject);
    this._oEngine.putUnique(sObjectStoreName, dDbRecord, oObject.merged,
      function(iId, dDBRecord) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId, dDBRecord);
      }
    });

  },

  putUniqueKeyword: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;

    var dDbRecord = self._objectToDBRecord(sObjectStoreName, oObject);
    this._oEngine.putUniqueKeyword(sObjectStoreName, dDbRecord, function(iId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId);
      }
    });
  },

  putUniqueHistoryItem: function(sObjectStoreName, oObject, mOnSaveCallback) {
    var self = this;

    var dDbRecord = self._objectToDBRecord(sObjectStoreName, oObject);
    this._oEngine.putUniqueHistoryItem(sObjectStoreName, dDbRecord, function(iId) {
      if (mOnSaveCallback) {
        mOnSaveCallback.call(self, iId);
      }
    });
  },

  update: function(sObjectStoreName, sId, oObject, mOnSaveCallback) {
    var self = this;

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
  }

});
