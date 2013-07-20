'use strict';

Cotton.Translators.HISTORY_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oHistoryItem) {

    var dDbRecord = {
      'sUrl' : oHistoryItem.url(),
      'sTitle' : oHistoryItem.title(),
      'iLastVisitTime' : oHistoryItem.lastVisitTime(),
      'iVisitCount' : oHistoryItem.visitCount(),
      'sStoryId' : oHistoryItem.storyId(),
      'oExtractedDNA' : {
        'lQueryWords' : oHistoryItem.extractedDNA().queryWords(),
        'lExtractedWords' : oHistoryItem.extractedDNA().extractedWords(),
        'dBagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get(),
        'lHighlightedText' : oHistoryItem.extractedDNA().highlightedText(),
        'sImageUrl' : oHistoryItem.extractedDNA().imageUrl(),
        'sMostReadParagraph' : oHistoryItem.extractedDNA().mostReadParagraph(),
        'iPercent' : oHistoryItem.extractedDNA().percent(),
        'fPageScore' : oHistoryItem.extractedDNA().pageScore(),
        'lParagraphs' : _.collect(oHistoryItem.extractedDNA().paragraphs(), function(oParagraph){ return oParagraph.serialize();}),
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

    oHistoryItem.initUrl(oDbRecord['sUrl']);
    oHistoryItem.setTitle(oDbRecord['sTitle']);
    oHistoryItem.setLastVisitTime(oDbRecord['iLastVisitTime']);
    oHistoryItem.setVisitCount(oDbRecord['iVisitCount']);


    var dExtractedDNA = oDbRecord['oExtractedDNA'];
    var oExtractedDNA = new Cotton.Model.HistoryItemDNA();
    oExtractedDNA.setQueryWords(dExtractedDNA['lQueryWords']);
    var oBagOfWords = new Cotton.Model.BagOfWords(dExtractedDNA['dBagOfWords']);
    oExtractedDNA.setBagOfWords(oBagOfWords);
    oExtractedDNA.setExtractedWords(dExtractedDNA['lExtractedWords']);
    oExtractedDNA.setHighlightedText(dExtractedDNA['lHighlightedText']);
    oExtractedDNA.setImageUrl(dExtractedDNA['sImageUrl']);
    oExtractedDNA.setMostReadParagraph(dExtractedDNA['sMostReadParagraph']);
    oExtractedDNA.setPercent(dExtractedDNA['iPercent']);
    oExtractedDNA.setPageScore(dExtractedDNA['fPageScore']);

    var lParagraphs = _.collect(dExtractedDNA['lParagraphs'], function(dDBRecord){
      var extractedParagraph = new Cotton.Model.ExtractedParagraph();
      extractedParagraph.deserialize(dDBRecord)
      return extractedParagraph;
    })
    oExtractedDNA.setParagraphs(lParagraphs);
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
      'unique' : true
    },
    'iLastVisitTime' : {
      'unique' : false
    },
    'sStoryId' : {
      'unique' : false
    }
  };

  var mChromeHistorytemToObject = function(dChromeHistoryItem){
    // distinction between oIDBHistoryItem and oChromeHistoryItem
    var oIDBHistoryItem = new Cotton.Model.HistoryItem();

    oIDBHistoryItem.initUrl(dChromeHistoryItem['url']);
    oIDBHistoryItem.setTitle(dChromeHistoryItem['title']);
    oIDBHistoryItem.setLastVisitTime(dChromeHistoryItem['lastVisitTime']);

    return oIDBHistoryItem;
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);

  // Add a specific method for this translator.
  oTranslator.chromeHistoryItemToObject = mChromeHistorytemToObject;
  Cotton.Translators.HISTORY_ITEM_TRANSLATORS.push(oTranslator);

})();
