'use strict';

Cotton.Translators.VISIT_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oVisitItem) {

    var dDbRecord = {
      'sUrl' : oVisitItem.url(),
      'sTitle' : oVisitItem.title(),
      'iVisitTime' : oVisitItem.visitTime(),
      'sFavicon' : oVisitItem.favicon(),
      'sStoryId' : oVisitItem.storyId(),
      'lQueryWords' : oVisitItem.queryWords(),
      'lExtractedWords' : oVisitItem.extractedWords(),
      'oExtractedDNA' : {
        'lHighlightedText' : oVisitItem.extractedDNA().highlightedText(),
        'lScores' : oVisitItem.extractedDNA().scores(),
        'sImageUrl' : oVisitItem.extractedDNA().imageUrl(),
        'sFirstParagraph' : oVisitItem.extractedDNA().firstParagraph(),
        'iPercent' : oVisitItem.extractedDNA().percent(),
        'fPageScore' : oVisitItem.extractedDNA().pageScore(),
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
    oVisitItem.initId(oDbRecord['id']);
    //oVisitItem._sChromeId = oDbRecord.sChromeVisitId;
    //oVisitItem._sChromeReferringVisitId = oDbRecord.sChromeReferringVisitId;
    oVisitItem.setStoryId(oDbRecord['sStoryId']);

    oVisitItem.initUrl(oDbRecord['sUrl']);
    oVisitItem.setTitle(oDbRecord['sTitle']);
    oVisitItem.setVisitTime(oDbRecord['iVisitTime']);
    oVisitItem.setFavicon(oDbRecord['sFavicon']);

    oVisitItem.setQueryWords(oDbRecord['lQueryWords']);
    oVisitItem.setExtractedWords(oDbRecord['lExtractedWords']);

    var dExtractedDNA = oDbRecord['oExtractedDNA'];
    var oExtractedDNA = new Cotton.Model.ExtractedDNA();
    oExtractedDNA.setHighlightedText(dExtractedDNA['lHighlightedText']);
    oExtractedDNA.setScores(dExtractedDNA['lScores']);
    oExtractedDNA.setImageUrl(dExtractedDNA['sImageUrl']);
    oExtractedDNA.setFirstParagraph(dExtractedDNA['sFirstParagraph']);
    oExtractedDNA.setPercent(dExtractedDNA['iPercent']);
    oExtractedDNA.setPageScore(dExtractedDNA['fPageScore']);

    oVisitItem.setExtractedDNA(oExtractedDNA);

    return oVisitItem;
  };

  var dIndexes = {
    'id' : {
      'unique' : true
    },
    'sUrl' : {
      'unique' : false
    },
    // sChromeId : {
    // unique : true
    // },
    'iVisitTime' : {
      'unique' : false
    },
    'sStoryId' : {
      'unique' : false
    }
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.VISIT_ITEM_TRANSLATORS.push(oTranslator);

})();
