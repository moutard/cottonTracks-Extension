/**
 * Absract layer for Cotton.DB.EngineIndexedDB.
 *
 */
Cotton.DB.IndexedDB.WrapperModel = Class.extend({

  init : function(sDatabaseName, dModels, mOnReadyCallback) {
    var self = this;
    this._sDatabaseName = sDatabaseName;
    self._dModels = dModels;

    var dIndexesForObjectStoreNames = {};
    _.each(dModels, function(oModelClass, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = oModelClass.prototype._dModelIndexes;
      console.log(dIndexesForObjectStoreNames);
    });

    var oEngine = new Cotton.DB.IndexedDB.Engine(
        sDatabaseName,
        dIndexesForObjectStoreNames,
        function() {
          mOnReadyCallback.call(self);
    });

    this._oEngine = oEngine;

  },

  empty : function(sObjectStoreName, mResultElementCallback){
     var self = this;

    this._oEngine.empty(sObjectStoreName, function(bIsEmpty){
       mResultElementCallback.call(self, bIsEmpty);
    });
  },
  _translatorForDbRecord: function(sObjectStoreName, dDbRecord) {
    return this._translator(sObjectStoreName, dDbRecord['sFormatVersion']);
  },

  _translatorForObject: function(sObjectStoreName, oObject) {
    return this._lastTranslator(sObjectStoreName);
  },

  /**
   * Returns the translator matching the given type and format version. Throws
   * an exception if there is no such translator.
   *
   * @param {String} sObjectStoreName:
   *  name of the store (table in the database).
   * @param {String} sFormatVersion:
   *  version of the model.
   */
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

  /**
   * Returns the last translator for the given type. Throws an exception if the
   * type does not have any translators.
   *
   * @param {String} sObjectStoreName:
   *  name of the store (table in the database).
   */
  _lastTranslator: function(sObjectStoreName) {
    var lTranslators = this._dTranslators[sObjectStoreName];
    if (!lTranslators) {
      throw "Unknown type."
    }
    var oTranslator = lTranslators[lTranslators.length - 1];
    return oTranslator;
  }
});
