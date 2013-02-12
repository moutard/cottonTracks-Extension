'use strict';

Cotton.DB.Store = Class.extend({

  init : function(sDatabaseName, dTranslators, oEngine, mOnReadyCallback) {
    var self = this;
    this._dTranslators = dTranslators;

    var dIndexesForObjectStoreNames = {};
    _.each(dTranslators, function(lTranslators, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(sObjectStoreName).indexDescriptions();
    });

    this._oEngine = oEngine;
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
