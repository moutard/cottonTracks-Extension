'use strict';

/**
 * Abstract layer that wrap a engine for a specific database.
 *
 * Whatever the format of the stored record in the database, the wrapper return
 * a javascript object with its methods corresponding to a model.
 */
Cotton.DB.Wrapper = Class.extend({

  init : function(sDatabaseName, dTranslators) {
    var self = this;
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
    var iLength = lTranslators.length;
    for (var i = 0, oTranslator; i < iLength; i++) {
      var oTranslator = lTranslators[i];
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
