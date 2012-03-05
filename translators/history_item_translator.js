'use strict';

Cotton.Translators.HISTORY_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {
  
  var mObjectToDbRecordConverter = function(oHistoryItem) {
 
    var dDbRecord = {
      sId: oHistoryItem.id;
      sUrl: oHistoryItem.url;
      sTitle: oHistoryITem.title;
      fLastVisitTime: oHistoryItem.lastVisitTime;
      iVisitCount: oHistoryItem.visitCount;
      iTypedCount: oHistoryItem.typedCount;
    };

    // TODO(rmoutard): ask fwouts why it's important ?
    var iId = oHistoryItem.id() || null;
    if (iId) {
      dDbRecord.id = iId;
    }
    return dDbRecord;
  };
  
  var mDbRecordToObjectConverter = function(oDbRecord) {
    var oHistoryItem = new Cotton.Model.HistoryItem(oDbRecord);
    return oHistoryItem;
  };
  
  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter, mDbRecordToObjectConverter);
  Cotton.Translators.HISTORY_ITEM_TRANSLATORS.push(oTranslator);
  
})();
