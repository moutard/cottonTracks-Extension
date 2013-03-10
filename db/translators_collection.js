'use strict';

/**
 * Collection of all the translators.
 * For all objects it can find the corresponding translator depending on the
 * type of the object and the version, and translate it to a DBRecord that is
 * a simple dictionnary.
 *
 * And for a dictionnary it can return an instance of the corresponding object.
 *
 * In the ideal case there should be only one instance of the TranslatorCollection.
 */
Cotton.DB.TranslatorsCollection = Class.extend({

  /**
   * @constructor
   * @param {Object} dTranslators:
   *  - key: name of the store (table) for this type of object.
   *  - value: list containing all the translators for this type of object.
   *  Ex : {
   *       'stories' : Cotton.Translators.STORY_TRANSLATORS,
   *       'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
   *       'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
   *       }
   */
  init : function(dTranslators) {
    var self = this;
    this._dTranslators = dTranslators;
  },

  /**
   * Using infos contained in translators generate indexes for each stores.
   * This method is very usefull to create an engine.
   * TODO(rmoutard) : separate translators and model.
   */
  getIndexesForObjectStoreNames : function(){
    var self = this;
    var dIndexesForObjectStoreNames = {};
    _.each(self._dTranslators, function(lTranslators, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(
        sObjectStoreName).indexDescriptions();
    });
    return dIndexesForObjectStoreNames;
  },

  dbRecordToObject : function(sObjectStoreName, dDbRecord) {
    return this._translatorForDbRecord(sObjectStoreName, dDbRecord).dbRecordToObject(dDbRecord);
  },

  objectToDbRecord : function(sObjectStoreName, oObject) {
    return this._translatorForObject(sObjectStoreName, oObject).dbRecordToObject(oObject);
  },

  /**
   * Return the good translator that corresponds to the store name and the
   * version.
   * @param {String} sObjectStoreName:
   *  name of the store (table)
   * @param {Object} dDbRecord:
   *  the record you want to translate to object.
   */
  _translatorForDbRecord: function(sObjectStoreName, dDbRecord) {
    return this._translator(sObjectStoreName, dDbRecord['sFormatVersion']);
  },

  /**
   * Return the good translator that corresponds to the store name and the
   * version.
   * @param {String} sObjectStoreName:
   *  name of the store (table)
   * @param {Object} oObject:
   *  the record you want to translate to record.
   */
  _translatorForObject: function(sObjectStoreName, oObject) {
    return this._lastTranslator(sObjectStoreName);
  },

  /**
   * Returns the translator matching the given type and format version.
   * Throws an exception if there is no such translator.
   * @param {String} sObjectStoreName;
   *  name of the store (table)
   * @param {String} sFormatVersion:
   *  Version of the record.
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
   * Returns the last translator for the given type.
   * Throws an exception if the type does not have any translators.
   * @param {String} sObjectStoreName:
   *   name of the store (table)
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
