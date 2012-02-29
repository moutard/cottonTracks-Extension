'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oObject) {
    // TODO(fwouts): Implement.
    return {
      id: 0
    };
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    // TODO(fwouts): Implement.
    
  };
  
  var oTranslator = new Cotton.DB.Translator('stories', '0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);
});
