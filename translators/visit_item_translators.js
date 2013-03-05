'use strict';

Cotton.Translators.VISIT_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oVisitItem) {

    var dDbRecord = {
      'sUrl' : oVisitItem.url(),
      'sTitle' : oVisitItem.title(),
      'iVisitTime' : oVisitItem.visitTime(),
      'sStoryId' : oVisitItem.storyId(),
      'lQueryWords' : oVisitItem.queryWords(),
      'lExtractedWords' : oVisitItem.extractedWords(),
      'oExtractedDNA' : {
        'lHighlightedText' : oVisitItem.extractedDNA().highlightedText(),
        'sImageUrl' : oVisitItem.extractedDNA().imageUrl(),
        'sFirstParagraph' : oVisitItem.extractedDNA().firstParagraph(),
        'sMostReadParagraph' : oVisitItem.extractedDNA().mostReadParagraph(),
        'iPercent' : oVisitItem.extractedDNA().percent(),
        'fPageScore' : oVisitItem.extractedDNA().pageScore(),
        'iImageCropped' : oVisitItem.extractedDNA().imageCropped(),
        'iImageMarginTop' : oVisitItem.extractedDNA().imageMarginTop(),
        'iScrollablePosition' : oVisitItem.extractedDNA().scrollablePosition(),
        'lParagraphs' : _.collect(oVisitItem.extractedDNA().paragraphs(), function(oParagraph){ return oParagraph.serialize();}),
        'lAllParagraphs' : oVisitItem.extractedDNA().allParagraphs(),
        'lCopyPaste' : oVisitItem.extractedDNA().copyPaste(),
        'fTimeTabActive' : oVisitItem.extractedDNA().timeTabActive(),
        'fTimeTabOpen' : oVisitItem.extractedDNA().timeTabOpen(),
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

    oVisitItem.setQueryWords(oDbRecord['lQueryWords']);
    oVisitItem.setExtractedWords(oDbRecord['lExtractedWords']);

    var dExtractedDNA = oDbRecord['oExtractedDNA'];
    var oExtractedDNA = new Cotton.Model.ExtractedDNA();
    oExtractedDNA.setHighlightedText(dExtractedDNA['lHighlightedText']);
    oExtractedDNA.setImageUrl(dExtractedDNA['sImageUrl']);
    oExtractedDNA.setFirstParagraph(dExtractedDNA['sFirstParagraph']);
    oExtractedDNA.setMostReadParagraph(dExtractedDNA['sMostReadParagraph']);
    oExtractedDNA.setPercent(dExtractedDNA['iPercent']);
    oExtractedDNA.setPageScore(dExtractedDNA['fPageScore']);

    var lParagraphs = _.collect(dExtractedDNA['lParagraphs'], function(dDBRecord){
      var extractedParagraph = new Cotton.Model.ExtractedParagraph();
      extractedParagraph.deserialize(dDBRecord)
      return extractedParagraph;
    })
    oExtractedDNA.setParagraphs(lParagraphs);
    oExtractedDNA.setAllParagraphs(dExtractedDNA['lAllParagraphs']);
    oExtractedDNA.setCopyPaste(dExtractedDNA['lCopyPaste']);

    oExtractedDNA.setImageCropped(dExtractedDNA['iImageCropped']);
    oExtractedDNA.setImageMarginTop(dExtractedDNA['iImageMarginTop']);
    oExtractedDNA.setScrollablePosition(dExtractedDNA['iScrollablePosition']);
    oExtractedDNA.setTimeTabActive(dExtractedDNA['fTimeTabActive']);
    oExtractedDNA.setTimeTabOpen(dExtractedDNA['fTimeTabOpen']);

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
