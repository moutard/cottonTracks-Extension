'use strict';

Cotton.Translators.VISIT_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oVisitItem) {

    var dDbRecord = {
      sUrl : oVisitItem.url(),
      sTitle : oVisitItem.title(),
      iVisitTime : oVisitItem.visitTime(),
      sStoryId : oVisitItem.storyId(),
      oExtractedDNA : {
              'lHighlightedText' : oVisitItem._oExtractedDNA._lHighlightedText,
              'lScores' : oVisitItem._oExtractedDNA._lScores,
                      },
    };

    // Simple configuration.
    if (oVisitItem.id() !== undefined){
      // else id will be auto-incremented by engine. Because its the first time
      // you add this visitItem.
      dDbRecord.id = oVisitItem.id();
    }

    if (oVisitItem.chromeId() !== undefined){
      dDbRecord.sChromeId = oVisitItem.chromeId();
    }

    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oVisitItem = new Cotton.Model.VisitItem();
    // Use private attributes because they are immutable.
    oVisitItem._sId = oDbRecord.id;
    oVisitItem._sChromeId = oDbRecord.sChromeVisitId;
    oVisitItem._sStoryId =  oDbRecord.sStoryId;

    oVisitItem._sUrl = oDbRecord.sUrl;
    oVisitItem._sTitle = oDbRecord.sTitle;
    oVisitItem._iVisitTime = oDbRecord.iVisitTime;

    oVisitItem._oExtractedDNA._lHighlightedText =
                        oDbRecord.oExtractedDNA.lHighlightedText;
    oVisitItem._oExtractedDNA._lScores =
                        oDbRecord.oExtractedDNA.lScores;
    return oVisitItem;
  };

  var dIndexes = {
    id : {
      unique : true
    },
    sUrl : {
      unique : false
    },
    sChromeId : {
      unique : true
    },
    iVisitTime : {
      unique : false
    },
    sStoryId : {
      unique : false
    }
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.VISIT_ITEM_TRANSLATORS.push(oTranslator);

})();
