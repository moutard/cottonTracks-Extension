
test("merge search keywords", function(){
  var oSearchKeyword1 = new Cotton.Model.SearchKeyword('alice');
  oSearchKeyword1.initId(4);
  oSearchKeyword1.addReferringHistoryItemId(1);
  oSearchKeyword1.addReferringHistoryItemId(2);

  var oSearchKeyword2 = new Cotton.Model.SearchKeyword('alice');
  oSearchKeyword2.addReferringHistoryItemId(4);
  oSearchKeyword2.addReferringHistoryItemId(5);
  oSearchKeyword2.addReferringStoryId(9);

  var oTranslator = Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS[Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS.length - 1];
  dSearchKeyword1 = oTranslator.objectToDbRecord(oSearchKeyword1);
  dSearchKeyword2 = oTranslator.objectToDbRecord(oSearchKeyword2);
  dMergeKeyword = oTranslator.mergeDBRecords()(dSearchKeyword1, dSearchKeyword2);

  deepEqual(dMergeKeyword['id'], 4);
  deepEqual(dMergeKeyword['lReferringStoriesId'], [9]);
  deepEqual(dMergeKeyword['lReferringHistoryItemsId'].sort(), ([1,2, 4, 5]).sort());
});
