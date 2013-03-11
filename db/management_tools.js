'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    // "pool" : "HISTORY_ITEM_TRANSLATORS",
    "historyItems" : "HISTORY_ITEM_TRANSLATORS",
};

Cotton.DB.ManagementTools.createStory = function(sTitle, sFeaturedImage){
  var self = this;
  var oStory = new Cotton.Model.Story();
  oStory.setTitle(sTitle);
  oStory.setFeaturedImage(sFeaturedImage);
  oStory.setLastVisitTime(new Date().getTime());
  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.put('stories', oStory, function(iId){
      console.log(iId);
    });
  });
};

Cotton.DB.ManagementTools.addHistoryItemToStory = function(iStoryId, iHistoryItemId){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.addHistoryItemId(iHistoryItemId);
      self._oDatabase.put('stories', oStory, function(){
        console.log('historyItem added.');
      });
    });
  });
};

Cotton.DB.ManagementTools.setStoryBagOfWords = function(iStoryId, dBagOfWords){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.dna().bagOfWords().setBag(dBagOfWords);
      self._oDatabase.put('stories', oStory, function(){
        console.log('bagOfWords updated.');
        for(var sKey in dBagOfWords){
          var oSearchKeyword = new Cotton.Model.SearchKeyword(sKey);
          oSearchKeyword.addReferringStoryId(iStoryId);
          self._oDatabase.putUniqueKeyword('searchKeywords', oSearchKeyword,
            function(){
              console.log('searchKeywords updated.');
            });
        }
      });
    });
  });
};
