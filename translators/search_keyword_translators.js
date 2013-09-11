'use strict';

Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oSearchKeyword) {

    var dDbRecord = {
      // id : id is auto-incremented.
      'sKeyword' : oSearchKeyword.keyword(),
      'lReferringHistoryItemsId' : oSearchKeyword.referringHistoryItemsId(),
      'lReferringStoriesId' : oSearchKeyword.referringStoriesId(),
    };
    var iId = oSearchKeyword.id() || null;
    if (iId) {
      dDbRecord['id'] = iId;
    }
    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {

    var oSearchKeyword = new Cotton.Model.SearchKeyword(oDbRecord['sKeyword']);
    oSearchKeyword.initId(oDbRecord['id']);

    oSearchKeyword.setReferringHistoryItemsId(oDbRecord['lReferringHistoryItemsId']);
    oSearchKeyword.setReferringStoriesId(oDbRecord['lReferringStoriesId']);

    return oSearchKeyword;
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
    'sKeyword' : {
      'unique' : true
    },
  };

  /**
   * dDBRecord1 is the one already in the database.
   */
  var mMergeDBRecords = function(dDBRecord1, dDBRecord2) {
    dDBRecord2['id'] = dDBRecord1['id'];
    dDBRecord2['lReferringStoriesId'] = _.union(
        dDBRecord2['lReferringStoriesId'],
        dDBRecord1['lReferringStoriesId']);
    dDBRecord2['lReferringHistoryItemsId'] = _.union(
        dDBRecord2['lReferringHistoryItemsId'],
        dDBRecord1['lReferringHistoryItemsId']);
    return dDBRecord2;
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes, mMergeDBRecords);
  Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS.push(oTranslator);

})();
