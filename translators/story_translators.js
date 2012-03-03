'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oObject) {
    // TODO(fwouts): Implement.
    var dDbRecord = {
      sText: oObject._lHistoryItems
    };
    var iId = oObject.id() || null;
    if (iId) {
      dDbRecord.id = iId;
    }
    return dDbRecord;
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    // TODO(fwouts): Implement.
    return new Cotton.Model.Story(oDbRecord.sText + ' ' + oDbRecord.id);
  };
  
  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);
})();
