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
 * Dump the chrome history in it's raw version in a file.
 */
Cotton.Management.dumpStoryFromDbInFile = function (iStoryId) {
  Cotton.Management.dumpStoryFromDb(iStoryId, function(dStoryOfHistoryDict){
    var sRecord = JSON.stringify(dStoryOfHistoryDict);
    var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    window.open(sUriContent, 'chrome_history_source_yourname');
  });
};