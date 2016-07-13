'use strict';

Cotton.Translators.STORY_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oStory) {

    var dDbRecord = {
      // id : id is auto-incremented. Becareful do not confuse with
      // clusterId, that is a temporary id attribute by DBSCAN to a new
      // story.
      'lHistoryItemsId' : oStory.historyItemsId(),
      'fLastVisitTime' : oStory.lastVisitTime(),
      'fRelevance' : oStory.relevance(),
      'sTitle' : oStory.title(),
      'sFeaturedImage' : oStory.featuredImage(),
      'lTags' : oStory.tags(),
      'oDNA' : {
        'oBagOfWords' : oStory.dna().bagOfWords().get(),
      },
      'bFavorite' : oStory.isFavorite(),
      'bBannedFromSuggest' : oStory.isBannedFromSuggest(),
    };
    var iId = oStory.id() || null;
    if (iId) {
      dDbRecord['id'] = iId;
    }
    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {

    var oStory = new Cotton.Model.Story();
    oStory.setId(oDbRecord['id']);

    if (oDbRecord['fLastVisitTime'] !== undefined) {
      oStory.setLastVisitTime(oDbRecord['fLastVisitTime']);
    }
    if (oDbRecord['fRelevance'] !== undefined) {
      oStory.setRelevance(oDbRecord['fRelevance']);
    }
    oStory.setTitle(oDbRecord['sTitle']);
    oStory.setFeaturedImage(oDbRecord['sFeaturedImage']);

    var oStoryDNA = new Cotton.Model.StoryDNA();
    //FIXME(rmoutard) : for the moment the bag of words will be written by
    // tags.
    if(oDbRecord['lTags']){
      oStory.setTags(oDbRecord['lTags']);
    }
    var oBagOfWords = new Cotton.Model.BagOfWords(oDbRecord['oDNA']['oBagOfWords']);
    oStoryDNA.setBagOfWords(oBagOfWords);
    oStory.setDNA(oStoryDNA);
    var iLength = oDbRecord['lHistoryItemsId'].length;
    if (oDbRecord['lHistoryItemsId'] !== undefined) {
      for ( var i = 0; i < iLength; i++) {
        var iHistoryItemId = oDbRecord['lHistoryItemsId'][i];
        oStory.addHistoryItemId(iHistoryItemId);
      }
    }
    oStory.setFavorite(oDbRecord['bFavorite']);
    oStory.setBannedFromSuggest(oDbRecord['bBannedFromSuggest']);
    return oStory;
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
    },
    'lTags' : {
      'unique' : false,
      'multiEntry' : true
    },
    'bFavorite' : {
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
  Cotton.Translators.STORY_TRANSLATORS.push(oTranslator);

})();
