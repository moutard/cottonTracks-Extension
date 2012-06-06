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
      lQueryWords : oVisitItem.queryWords(),
      lExtractedWords : oVisitItem.extractedWords(),
      oExtractedDNA : {
        'lHighlightedText' : oVisitItem._oExtractedDNA._lHighlightedText,
        'lScores' : oVisitItem._oExtractedDNA._lScores,
        'sImageUrl' : oVisitItem._oExtractedDNA._sImageUrl,
        'sFirstParagraph' : oVisitItem._oExtractedDNA._sFirstParagraph,
        'iPercent' : oVisitItem._oExtractedDNA._iPercent,
        'fPageScore' : oVisitItem._oExtractedDNA._fPageScore,
      },
    };

    // Simple configuration.
    if (oVisitItem.id() !== undefined) {
      // else id will be auto-incremented by engine. Because its the first time
      // you add this visitItem.
      dDbRecord.id = oVisitItem.id();
    }

    if (oVisitItem.chromeId() !== undefined) {
      dDbRecord.sChromeId = oVisitItem.chromeId();
    }

    if (oVisitItem.chromeReferringVisitId() !== undefined) {
      dDbRecord.chromeReferringVisitId = oVisitItem.chromeReferringVisitId();
    }

    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oVisitItem = new Cotton.Model.VisitItem();
    // Use private attributes because they are immutable.
    oVisitItem._sId = oDbRecord.id;
    oVisitItem._sChromeId = oDbRecord.sChromeVisitId;
    oVisitItem._sChromeReferringVisitId = oDbRecord.sChromeReferringVisitId;
    oVisitItem._sStoryId = oDbRecord.sStoryId;

    oVisitItem._sUrl = oDbRecord.sUrl;
    oVisitItem._sTitle = oDbRecord.sTitle;
    oVisitItem._iVisitTime = oDbRecord.iVisitTime;

    oVisitItem._lQueryWords = oDbRecord.lQueryWords;
    oVisitItem._lExtractedWords = oDbRecord.lExtractedWords;

    oVisitItem._oExtractedDNA._lHighlightedText = oDbRecord.oExtractedDNA.lHighlightedText;
    oVisitItem._oExtractedDNA._lScores = oDbRecord.oExtractedDNA.lScores;
    oVisitItem._oExtractedDNA._sImageUrl = oDbRecord.oExtractedDNA.sImageUrl;
    oVisitItem._oExtractedDNA._sFirstParagraph = oDbRecord.oExtractedDNA.sFirstParagraph;
    oVisitItem._oExtractedDNA._iPercent = oDbRecord.oExtractedDNA.iPercent;
    oVisitItem._oExtractedDNA._fPageScore = oDbRecord.oExtractedDNA.fPageScore;

    return oVisitItem;
  };

  var dIndexes = {
    id : {
      unique : true
    },
    sUrl : {
      unique : false
    },
    //sChromeId : {
    //  unique : true
    //},
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
