'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    // "pool" : "HISTORY_ITEM_TRANSLATORS",
    "visitItems" : "VISIT_ITEM_TRANSLATORS",
};

Cotton.DB.ManagementTools.createStory = function(sTitle, sFeaturedImage){
  var self = this;
  var oStory = new Cotton.Model.Story();
  oStory.setTitle(sTitle);
  oStory.setFeaturedImage(sFeaturedImage);

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.put('stories', oStory, function(iId){
      console.log(iId);
    });
  });
};

Cotton.DB.ManagementTools.addVisitItemToStory = function(iStoryId, iVisitItemId){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.addVisitItemId(iVisitItemId);
      self._oDatabase.put('stories', oStory, function(){
        console.log('visitItem added.');
      });
    });
  });
};

Cotton.DB.ManagementTools.setStoryBagOfWords = function(iStoryId, dBagOfWords){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.dna().bagOfWords().setBag(dBagOfWords);
      self._oDatabase.put('stories', oStory, function(){
        console.log('bagOfWords updated.');
      });
    });
  });
};
