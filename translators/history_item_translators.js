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
        'dBagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get(),
        'sImageUrl' : oHistoryItem.extractedDNA().imageUrl(),
        'iPercent' : oHistoryItem.extractedDNA().percent(),
        'fPageScore' : oHistoryItem.extractedDNA().pageScore(),
        'lParagraphs' : _.collect(oHistoryItem.extractedDNA().paragraphs(), function(oParagraph){ return oParagraph.serialize();}),
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
    oExtractedDNA.setImageUrl(dExtractedDNA['sImageUrl']);
    oExtractedDNA.setPercent(dExtractedDNA['iPercent']);
    oExtractedDNA.setPageScore(dExtractedDNA['fPageScore']);

    var lParagraphs = _.collect(dExtractedDNA['lParagraphs'], function(dDBRecord){
      var extractedParagraph = new Cotton.Model.ExtractedParagraph();
      extractedParagraph.deserialize(dDBRecord)
      return extractedParagraph;
    })
    oExtractedDNA.setParagraphs(lParagraphs);

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

  var mMergeDBRecords = function(oResult, dItem) {
    var dMerged = {};
    // If there was no result, it will send back null.
    dItem['id'] = oResult['id'];
    dItem['iLastVisitTime'] = Math.max(dItem['iLastVisitTime'], oResult['iLastVisitTime']);

    var lParagraphs = [];
    // Make a local copy.
    lParagraphs = lParagraphs.concat(dItem['oExtractedDNA']['lParagraphs']);

    // For each paragraph in the original oResult, find the corresponding paragraphs
    // in dItem.
    var lResultParagraphs = oResult['oExtractedDNA']['lParagraphs'];
    var iLength = lResultParagraphs.length;
    for (var i = 0; i < iLength; i++) {
      var dResultParagraph = lResultParagraphs[i];
      // Indicates if the paragraph was present in the original.
      var bMerge = false;
      var lParagraphs = dItem['oExtractedDNA']['lParagraphs'];
      var jLength = lParagraphs.length;
      for (var j = 0; j < jLength; j++) {
        var dParagraph = lParagraphs[j];
        if (dResultParagraph['id'] === dParagraph['id']) {
          bMerge = true;
          dParagraph['fPercent'] = Math.max(dParagraph['fPercent'],dResultParagraph['fPercent']);
          var lQuotes = [];
          lQuotes = lQuotes.concat(dParagraph['lQuotes']);

          var kLength = dResultParagraph['lQuotes'].length;
          for (var k = 0; k < kLength; k++) {
            var dResultQuote = dResultParagraph['lQuotes'][k];
            // Indicates if the quote was present in the original.
            var bMergeQuote = false;
            var nLength = dParagraph['lQuotes'].length;
            for (var n = 0; n < nLength; n++) {
              var dQuote = dParagraph['lQuotes'][n];

              if ((dResultQuote['start']-dQuote['start'])*(dResultQuote['start']-dQuote['end']) <= 0
                //
                ||(dResultQuote['end']-dQuote['start'])*(dResultQuote['end']-dQuote['end']) <= 0
                //
                || (dResultQuote['start'] <= dQuote['start'] && dResultQuote['end'] >= dQuote['end'])) {
                  bMergeQuote = true;
                  dQuote['start'] = Math.min(dQuote['start'], dResultQuote['start']);
                  dQuote['end'] = Math.max(dQuote['end'], dResultQuote['end']);
                lQuotes[l] = dQuote;
              }
            }
            if (!bMergeQuote){
              lQuotes.push(dResultQuote);
            }
          }
          lParagraphs[j]['lQuotes'] = lQuotes;
          break;
        }
      }
      if (!bMerge) {
        lParagraphs.push(dResultParagraph);
      }
    }
    // FIXME(rmoutard) : Remove the sortBy util we use dictionnary.
    dItem['oExtractedDNA']['lParagraphs'] = lParagraphs;
    dItem['oExtractedDNA']['lQueryWords'] = oResult['oExtractedDNA']['lQueryWords'];
    // Take the max value of each key.
    var dTempBag = {};
    for (var sWord in dItem['oExtractedDNA']['dBagOfWords']) {
      var a = dItem['oExtractedDNA']['dBagOfWords'][sWord] || 0;
      var b = oResult['oExtractedDNA']['dBagOfWords'][sWord] || 0;
      dTempBag[sWord] = Math.max(a,b);
    }
    dItem['oExtractedDNA']['dBagOfWords'] = dTempBag;

    return dItem;
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes, mMergeDBRecords);

  // Add a specific method for this translator.
  oTranslator.chromeHistoryItemToObject = mChromeHistorytemToObject;
  Cotton.Translators.HISTORY_ITEM_TRANSLATORS.push(oTranslator);

})();
