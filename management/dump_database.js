/**
 * Dumps a story selected with its id from the db into a JSON
 * @param function
 */
Cotton.Management.dumpStoryFromDb = function(iStoryId, mActionWithStory){
  var dStoryOfHistoryDict = {};
  var iCount = 0;
  var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
      'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
      'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      oDatabase.find('stories', 'id', iStoryId, function(oStory){
        dStoryOfHistoryDict['storyTitle'] = oStory.title();
        dStoryOfHistoryDict['historyItems'] = [];
        var lHistoryItemsIds = oStory.historyItemsId();
        var iLengthOfStory = lHistoryItemsIds.length;
        oDatabase.findGroup('historyItems', 'id', lHistoryItemsIds, function(lHistoryItems){
          for(var i = 0, oCottonHistoryItem; oCottonHistoryItem = lHistoryItems[i]; i++){
            var dHistoryItem = {};
            dHistoryItem['title'] = oCottonHistoryItem.url();
            dHistoryItem['url'] = oCottonHistoryItem.url();
            dHistoryItem['bagOfWords'] = oCottonHistoryItem.extractedDNA().bagOfWords().get();
            dHistoryItem['visitTimes'] = [];
            dStoryOfHistoryDict['historyItems'].push(dHistoryItem);
            chrome.history.getVisits({'url' : dHistoryItem['url']},
              function(lChromeVisitItems){
                for (var j = 0, oChromeVisitItem; oChromeVisitItem = lChromeVisitItems[j]; j++){
                  dHistoryItem['visitTimes'].push(oChromeVisitItem['visitTime']);
                }
                iCount++;
                if (iCount == iLengthOfStory){
                  mActionWithStory (dStoryOfHistoryDict);
                }
            });
          }
        });
      });
  });
};

/**
 * Dump a selected story in a file.
 */
Cotton.Management.dumpStoryFromDbInFile = function (iStoryId) {
  Cotton.Management.dumpStoryFromDb(iStoryId, function(dStoryOfHistoryDict){
    var sRecord = JSON.stringify(dStoryOfHistoryDict);
    var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    window.open(sUriContent, 'chrome_history_source_yourname');
  });
};

/**
 * Dumps a story with its complete visitItems selected with its id from the db
 * @param function
 */
Cotton.Management.dumpRawStoryFromDb = function(iStoryId, mActionWithStory){
  var dStory = {};
  var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
      'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
      'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      oDatabase.find('stories', 'id', iStoryId, function(oStory){

        var lStoryTranslators = Cotton.Translators.STORY_TRANSLATORS;
        var oStoryTranslator = lStoryTranslators[lStoryTranslators.length - 1];
        dStory['story'] = oStoryTranslator.objectToDbRecord(oStory);

        var lHistoryItemsIds = oStory.historyItemsId();
        var iLengthOfStory = lHistoryItemsIds.length;
        oDatabase.findGroup('historyItems', 'id', lHistoryItemsIds, function(lHistoryItems){
          dStory['historyItems'] = [];
          var lHistoryItemTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
          var oHistoryItemTranslator = lHistoryItemTranslators[lHistoryItemTranslators.length - 1];

          for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
            dStory['historyItems'][i] = oHistoryItemTranslator.objectToDbRecord(oHistoryItem);
          }
          mActionWithStory (dStory);
        });
      });
  });
};

/**
 * Dump a selected story unaltered in a JSON file.
 */
Cotton.Management.dumpRawStoryFromDbInFile = function (iStoryId) {
  Cotton.Management.dumpRawStoryFromDb(iStoryId, function(dStory){
    var sRecord = JSON.stringify(dStory);
    var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    window.open(sUriContent, 'chrome_history_source_yourname');
  });
};

/**
 * Dump a selected story unaltered in a JSON file.
 */
Cotton.Management.dumpGroupRawStoryFromDbInFile = function (lStoryIds) {
  var iNumberOfStories = lStoryIds.length;
  var lStories = [];
  var iCount = 0;
  for (var i = 0, iStoryId; iStoryId = lStoryIds[i]; i++){
    Cotton.Management.dumpRawStoryFromDb(iStoryId, function(dStory){
      lStories.push(dStory);
      iCount++;
      if (iCount === iNumberOfStories){
        var sRecord = JSON.stringify(lStories);
        var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
        window.open(sUriContent, 'chrome_history_source_yourname');
      }
    });
  }
};
