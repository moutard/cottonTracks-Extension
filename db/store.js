'use strict';

Cotton.DB.Store = function(sDatabaseName, dTranslators, mOnReadyCallback) {
  var self = this;
  
  this._dTranslators = dTranslators;
  this._oEngine = new Cotton.DB.Engine(sDatabaseName, _.keys(dTranslators), function() {
    mOnReadyCallback.call(self);
  });
};

$.extend(Cotton.DB.Store.prototype, {
  
  // Must be called once the store is ready.
  list: function(sObjectType) {
    var lTranslators = this._dTranslators[sObjectType];
    if (!lTranslators) {
      throw "Unknown type."
    }
    this._oEngine.list(sObjectType, function(oResult) {
      // TODO(fwouts): Store the translators as a hash using versions as keys?
      // TODO(fwouts): Use this syntax in other places?
      var oTranslator;
      for (var iI = 0; oTranslator = lTranslators[iI]; iI++) {
        if (oTranslator.formatVersion() == oResult.sFormatVersion) {
          break;
        }
      }
      if (!oTranslator) {
        throw "No translator matching record version (" + oResult.sFormatVersion + " for type " + sObjectType + ")."
      }
      var oObject = oTranslator.dbRecordToObject(oResult);
      console.log(oObject._lHistoryItems);
    });
  },
  
  // Must be called once the store is ready.
  put: function(sObjectType, oObject, mOnSaveCallback) {
    var self = this;
    
    // TODO(fwouts): Do not copy-paste this.
    var lTranslators = this._dTranslators[sObjectType];
    if (!lTranslators) {
      throw "Unknown type."
    }
    // TODO(fwouts): Do not always select the last?
    var oTranslator = lTranslators[lTranslators.length - 1];
    var dDbRecord = oTranslator.objectToDbRecord(oObject);
    
    this._oEngine.put(sObjectType, dDbRecord, function() {
      mOnSaveCallback.call(self);
    });
  },
});

// For testing.
$(function() {
  new Cotton.DB.Store('cotton', { 'stories': Cotton.Translators.STORY_TRANSLATORS }, function() {
    this.put('stories', new Cotton.Model.Story('youhou 2'), function() {
      this.list('stories');
    });
  });
});
