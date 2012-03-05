'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oStory) {
    // TODO(fwouts): Implement.
    var dDbRecord = {
      id : oStory._iId,
      // TODO(rmoutard&fwouts): how to use hsitoryItem translator
      lHistoryItems : oStory._lHistoryItems,
      fLastVisitTime : oStory._fLastVisitTime,
      fRelevance : oStory._fRelevance,
    };
    var iId = oStory.id() || null;
    if (iId) {
      dDbRecord.id = iId;
    }
    return dDbRecord;
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    // TODO(fwouts): Implement.
    var oStory = new Cotton.Model.Story();
    oStory.setId(oDbRecord.id);
    if(oDbRecord.fRelevance !== undefined){
      oStory.setRelevance(oDbRecord.fRelevance);
    }
    if(oDbRecord.lHistoryItems !== undefined){
      for(var i = 0, oHistoryItem; oHistoryItem = oDbRecord.lHistoryItems[i]; i++){
        oStory.addHistoryItem(oHistoryItem)
      }
    }
    return oStory;
  };
  
  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);
  
})();
