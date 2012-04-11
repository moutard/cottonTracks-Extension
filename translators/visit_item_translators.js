'use strict';

Cotton.Translators.VISIT_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oVisitItem) {

    var dDbRecord = {
      sUrl : oVisitItem.url(),
      sTitle : oVisitItem.title(),
      iVisitTime : oVisitItem.visitTime(),
    };

    // Simple configuration.
    if (oVisitItem.id() !== undefined)
      // else id will be auto-incremented by engine. Because its the first time
      // you add this visitItem.
      dDbRecord.id = oVisitItem.id();

    if (oVisitItem.chromeId() !== undefined)
      dDbRecord.sChromeId = oVisitItem.chromeId();

    // Complexe configuration.
    // dDbRecord.lTextHighlighter = oVisitItem.lTextHighlighter || undefined;
    // dDbRecord.iScrollCount = oVisitItem.iScrollCount || undefined;
    // dDbRecord.lCopyPaste = oVisitItem.iScrollCount || undefined;
    // dDbRecord.lPScore = oVisitItem.iScrollCount || undefined;

    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oVisitItem = new Cotton.Model.HistoryItem();
    // Use private attributes because they are immutable.
    oVisitItem._sId = oDbRecord.id;
    oVisitItem._sChromeId = oDbRecord.sChromeVisitId;

    oVisitItem._sUrl = oDbRecord.sUrl;
    oVisitItem._sTitle = oDbRecord.sTitle;
    oVisitItem._iVisitTime = oDbRecord.iVisitTime;

    oVisitItem.lTextHighlighter = oDbRecord.lTextHighlighter || undefined;
    oVisitItem.iScrollCount = oDbRecord.iScrollCount || undefined;
    oVisitItem.lCopyPaste = oDbRecord.iScrollCount || undefined;
    oVisitItem.lPScore = oDbRecord.iScrollCount || undefined;

    return oVisitItem;
  };

  var dIndexes = {
    sUrl : {
      unique : false
    },
    sChromeId : {
      unique : true
    },
    iVisitTime : {
      unique : false
    }
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.VISIT_ITEM_TRANSLATORS.push(oTranslator);

})();
