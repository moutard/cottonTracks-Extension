'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oObject) {
    // TODO(fwouts): Implement.
    return {
      // TODO(fwouts): Remove the need for this. Only a numeric id should be provided (or maybe even nothing if new?).
      id: ['stories', 1],
      text: oObject.lHistoryItems
    };
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    // TODO(fwouts): Implement.
    return new Cotton.Model.Story(oDbRecord.text);
  };
  
  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);
})();
