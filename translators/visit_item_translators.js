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
      'iPool' : oVisitItem.pool(),
      'oExtractedDNA' : {
        'lQueryWords' : oVisitItem.extractedDNA().queryWords(),
        'lExtractedWords' : oVisitItem.extractedDNA().extractedWords(),
        'dBagOfWords' : oVisitItem.extractedDNA().bagOfWords().get(),
        'lHighlightedText' : oVisitItem.extractedDNA().highlightedText(),
        'sImageUrl' : oVisitItem.extractedDNA().imageUrl(),
        'sFirstParagraph' : oVisitItem.extractedDNA().firstParagraph(),
        'sMostReadParagraph' : oVisitItem.extractedDNA().mostReadParagraph(),
        'iPercent' : oVisitItem.extractedDNA().percent(),
        'fPageScore' : oVisitItem.extractedDNA().pageScore(),
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


    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oVisitItem = new Cotton.Model.VisitItem();
    // Use private attributes because they are immutable.
    oVisitItem.initId(oDbRecord['id']);
    oVisitItem.setStoryId(oDbRecord['sStoryId']);
    oVisitItem.setPool(oDbRecord['iPool']);

    oVisitItem.initUrl(oDbRecord['sUrl']);
    oVisitItem.setTitle(oDbRecord['sTitle']);
    oVisitItem.setVisitTime(oDbRecord['iVisitTime']);


    var dExtractedDNA = oDbRecord['oExtractedDNA'];
    var oExtractedDNA = new Cotton.Model.VisitItemDNA();
    oExtractedDNA.setQueryWords(dExtractedDNA['lQueryWords']);
    oExtractedDNA.setExtractedWords(dExtractedDNA['lExtractedWords']);
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
    'iVisitTime' : {
      'unique' : false
    },
    'sStoryId' : {
      'unique' : false
    },
    'iPool' : {
      'unique' : false
    }

  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.VISIT_ITEM_TRANSLATORS.push(oTranslator);

})();
