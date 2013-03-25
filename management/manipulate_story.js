Cotton.Management.createStory = function(sTitle, sFeaturedImage){
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

Cotton.Management.createStoryFromList = function(sTitle, sFeaturedImage,
    lHistoryItems){
  var self = this;
  var oStory = new Cotton.Model.Story();
  oStory.setTitle(sTitle);
  oStory.setFeaturedImage(sFeaturedImage);
  oStory.setLastVisitTime(new Date().getTime());
  var lHistoryItemsId = [];
  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
  }, function() {
    for(var i = 0, dHistoryItem; dHistoryItem = lHistoryItems[i]; i++){
      //var oTranslator = self._oDatabase._translatorForDbRecord('historyItems', dHistoryItem);
      //var oHistoryItem = oTranslator.
      var oHistoryItem = new Cotton.Model.HistoryItem();
      oHistoryItem.setLastVisitTime(dHistoryItem['iLastVisitTime']);
      oHistoryItem.setTitle(dHistoryItem['sTitle']);
      oHistoryItem.initUrl(dHistoryItem['sUrl']);
      self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId){
        var _iId = iId;
        console.log(_iId);
        lHistoryItemsId.push(_iId);
        console.log(lHistoryItemsId.length + '' + lHistoryItems.length);
        if(lHistoryItemsId.length === lHistoryItems.length){
            var oStory = new Cotton.Model.Story();
            oStory.setTitle(sTitle);
            oStory.setFeaturedImage(sFeaturedImage);
            oStory.setLastVisitTime(new Date().getTime());
            oStory._lHistoryItemsId = lHistoryItemsId;
            var dBagOfWords = {};
            var lList = sTitle.split(' ');
            for(var i=0, sKeyword; sKeyword = lList[i]; i++){
              dBagOfWords[sKeyword] = 10;
            }
            oStory.dna().bagOfWords().setBag(dBagOfWords);
            self._oDatabase.put('stories', oStory, function(iStoryId){
              console.log(iStoryId);
              console.log('story created');

              for(var i=0, sKeyword; sKeyword = lList[i]; i++){
                var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
                oSearchKeyword.addReferringStoryId(iStoryId);
                self._oDatabase.putUniqueKeyword('searchKeywords',oSearchKeyword,
                  function(){
                });
              }
            });
        }
      });
    }
  });
};


Cotton.Management.addHistoryItemToStory = function(iStoryId, iHistoryItemId){
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

Cotton.Management.setStoryBagOfWords = function(iStoryId, dBagOfWords){
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
