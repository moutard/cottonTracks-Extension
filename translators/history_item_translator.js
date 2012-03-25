'use strict';

Cotton.Translators.HISTORY_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oHistoryItem) {

    var dDbRecord = {};

    // oHistoryItem is a chromeHistoryItem.
    if (oHistoryItem.id !== undefined) {
      dDbRecord = {
        sChromeId : oHistoryItem.id, // to keep a link with chrome history
        sUrl : oHistoryItem.url,
        sTitle : oHistoryItem.title,
        fLastVisitTime : oHistoryItem.lastVisitTime,
        iVisitCount : oHistoryItem.visitCount,
        iTypedCount : oHistoryItem.typedCount,
      };
    } else {
      // else oHistoryItem is a CottonHistoryItem.
      dDbRecord = {
        // sId : oHistoryItem.id, auto incremented
        sChromeId : oHistoryItem.chromeId(), // to keep a link with chrome
        // history
        sUrl : oHistoryItem.url(),
        sTitle : oHistoryITem.title(),
        fLastVisitTime : oHistoryItem.lastVisitTime(),
        iVisitCount : oHistoryItem.visitCount(),
        iTypedCount : oHistoryItem.typedCount(),
      };
    }
    // Handle expanded historyItem

    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oHistoryItem = new Cotton.Model.HistoryItem();
    if (oHistoryItem !== undefined) {
      // Use private attributes because they are immutable.
      oHistoryItem._sId = oDbRecord.id;
      oHistoryItem._sChromeId = oDbRecord.sChromeId;
      oHistoryItem._sUrl = oHistoryItem.sUrl;
      oHistoryItem._sTitle(oHistoryItem.sTitle);

      //
      oHistoryItem.setLastVisitTime(oHistoryItem.iLastVisitTime);
      oHistoryItem.setVisitCount(oHistoryItem.iVisitCount);
      oHistoryItem.setTypedCount(oHistoryItem.itypedCount);

    }

    return oHistoryItem;
  };

  var dIndexes = {
    sUrl : {
      unique : true
    },
    sChromeId : {
      unique : true
    },
    fLastVisitTime : {
      unique : false
    }
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.HISTORY_ITEM_TRANSLATORS.push(oTranslator);

})();
