'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oStory) {
    // TODO(fwouts): Implement.
    var dDbRecord = {
      sText: oStory._lHistoryItems
    };
    var iId = oStory.id() || null;
    if (iId) {
      dDbRecord.id = iId;
    }
    return dDbRecord;
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    // TODO(fwouts): Implement.
    var oStory = new Cotton.Model.Story(oDbRecord.sText + ' ' + oDbRecord.id);
    oStory.setId(oDbRecord.id);
    return oStory;
  };
  
  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);
})();
