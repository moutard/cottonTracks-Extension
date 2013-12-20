'use strict';

Cotton.Translators.CHEESECAKE_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oCheesecake) {

    var dDbRecord = {
      // id : id is auto-incremented.
      'lHistoryItemsId' : oCheesecake.historyItemsId(),
      'lHistoryItemsSuggestId' : oCheesecake.historyItemsSuggestId(),
      'lHistoryItemsExcludeId' : oCheesecake.historyItemsExcludeId(),
      'fLastVisitTime' : oCheesecake.lastVisitTime(),
      'sTitle' : oCheesecake.title(),
      'sFeaturedImage' : oCheesecake.featuredImage(),
      'oDNA' : {
        'oBagOfWords' : oCheesecake.dna().bagOfWords().get(),
      }
    };
    var iId = oCheesecake.id() || null;
    if (iId) {
      dDbRecord['id'] = iId;
    }
    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {

    var oCheesecake = new Cotton.Model.Cheesecake();
    oCheesecake.setId(oDbRecord['id']);

    if (oDbRecord['fLastVisitTime'] !== undefined) {
      oCheesecake.setLastVisitTime(oDbRecord['fLastVisitTime']);
    }
    oCheesecake.setTitle(oDbRecord['sTitle']);
    oCheesecake.setFeaturedImage(oDbRecord['sFeaturedImage']);

    var oCheesecakeDNA = new Cotton.Model.StoryDNA();
    //FIXME(rmoutard) : for the moment the bag of words will be written by
    // tags.
    var oBagOfWords = new Cotton.Model.BagOfWords(oDbRecord['oDNA']['oBagOfWords']);
    oCheesecakeDNA.setBagOfWords(oBagOfWords);
    oCheesecake.setDNA(oCheesecakeDNA);
    var iLength = oDbRecord['lHistoryItemsId'].length;
    if (oDbRecord['lHistoryItemsId'] !== undefined) {
      for ( var i = 0; i < iLength; i++) {
        var iHistoryItemId = oDbRecord['lHistoryItemsId'][i];
        oCheesecake.addHistoryItemId(iHistoryItemId);
      }
    }
    if (oDbRecord['lHistoryItemsSuggestId'] !== undefined) {
      for ( var i = 0; i < iLength; i++) {
        var iHistoryItemSuggestId = oDbRecord['lHistoryItemsSuggestId'][i];
        oCheesecake.addHistoryItemSuggestId(iHistoryItemSuggestId);
      }
    }
    if (oDbRecord['lHistoryItemsExcludeId'] !== undefined) {
      for ( var i = 0; i < iLength; i++) {
        var iHistoryItemExcludeId = oDbRecord['lHistoryItemsExcludeId'][i];
        oCheesecake.addHistoryItemExcludeId(iHistoryItemExcludeId);
      }
    }
    return oCheesecake;
  };

  // The dictionary of all index descriptions.
  /*
   * E.g. if we wanted to have a non-unique index on relevance: var dIndexes = {
   * fRelevance: { unique: false } };
   */
  var dIndexes = {
    // optional id is indexed automatically.
    'id' : {
      'unique' : true
    },
    'fLastVisitTime' : {
      'unique' : false
    }
  };

  /**
   * dDBRecord1 is the one already in the database.
   */
  var mMergeDBRecords = function(dDBRecord1, dDBRecord2) {
    dDBRecord2['id'] = dDBRecord1['id'];
    dDBRecord2['fLastVisitTime'] = Math.max(dDBRecord1['fLastVisitTime'], dDBRecord2['fLastVisitTime']);
    // Take the title of dDBRecord2 by default.
    if (dDBRecord2['sFeaturedImage'] === "") {
      dDBRecord2['sFeaturedImage'] = dDBRecord1['sFeaturedImage'];
    }
    // Take the max value of each key.
    var dTempBag = {};
    for (var sWord in dDBRecord1['oDNA']['dBagOfWords']) {
      var a = dDBRecord1['oDNA']['dBagOfWords'][sWord] || 0;
      var b = dDBRecord2['oDNA']['dBagOfWords'][sWord] || 0;
      dTempBag[sWord] = Math.max(a,b);
    }
    dDBRecord2['oDNA']['dBagOfWords'] = dTempBag;

    return dDBRecord2;
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes, mMergeDBRecords);
  Cotton.Translators.CHEESECAKE_TRANSLATORS.push(oTranslator);

})();