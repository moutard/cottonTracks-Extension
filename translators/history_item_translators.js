'use strict';

Cotton.Translators.HISTORY_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oHistoryItem) {

    var dDbRecord = {
      'sUrl' : oHistoryItem.url(),
      'sTitle' : oHistoryItem.title(),
      'iLastVisitTime' : oHistoryItem.lastVisitTime(),
      'sStoryId' : oHistoryItem.storyId(),
      'iPool' : oHistoryItem.pool(),
      'oExtractedDNA' : {
        'lQueryWords' : oHistoryItem.extractedDNA().queryWords(),
        'lExtractedWords' : oHistoryItem.extractedDNA().extractedWords(),
        'dBagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get(),
        'lHighlightedText' : oHistoryItem.extractedDNA().highlightedText(),
        'sImageUrl' : oHistoryItem.extractedDNA().imageUrl(),
        'sFirstParagraph' : oHistoryItem.extractedDNA().firstParagraph(),
        'sMostReadParagraph' : oHistoryItem.extractedDNA().mostReadParagraph(),
        'iPercent' : oHistoryItem.extractedDNA().percent(),
        'fPageScore' : oHistoryItem.extractedDNA().pageScore(),
        'lParagraphs' : _.collect(oHistoryItem.extractedDNA().paragraphs(), function(oParagraph){ return oParagraph.serialize();}),
        'lAllParagraphs' : oHistoryItem.extractedDNA().allParagraphs(),
        'lCopyPaste' : oHistoryItem.extractedDNA().copyPaste(),
        'fTimeTabActive' : oHistoryItem.extractedDNA().timeTabActive(),
        'fTimeTabOpen' : oHistoryItem.extractedDNA().timeTabOpen(),
      },
    };

    // Simple configuration.
    if (oHistoryItem.id() !== undefined) {
      // else id will be auto-incremented by engine. Because its the first time
      // you add this historyItem.
      dDbRecord.id = oHistoryItem.id();
    }


    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oHistoryItem = new Cotton.Model.HistoryItem();
    // Use private attributes because they are immutable.
    oHistoryItem.initId(oDbRecord['id']);
    oHistoryItem.setStoryId(oDbRecord['sStoryId']);
    oHistoryItem.setPool(oDbRecord['iPool']);

    oHistoryItem.initUrl(oDbRecord['sUrl']);
    oHistoryItem.setTitle(oDbRecord['sTitle']);
    oHistoryItem.setLastVisitTime(oDbRecord['iLastVisitTime']);


    var dExtractedDNA = oDbRecord['oExtractedDNA'];
    var oExtractedDNA = new Cotton.Model.HistoryItemDNA();
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

    oHistoryItem.setExtractedDNA(oExtractedDNA);

    return oHistoryItem;
  };

  var dIndexes = {
    'id' : {
      'unique' : true
    },
    'sUrl' : {
      'unique' : false
    },
    'iLastVisitTime' : {
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
  Cotton.Translators.HISTORY_ITEM_TRANSLATORS.push(oTranslator);

})();
