'use strict';
(function(){
var Manager = Class.extend({
  init: function(){
  },

  createStory : function(sTitle, sFeaturedImage){
    var self = this;
    var oStory = new Cotton.Model.Story();
    oStory.setTitle(sTitle);
    oStory.setFeaturedImage(sFeaturedImage);
    oStory.setLastVisitTime(new Date().getTime());
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
    }, function() {
      self._oDatabase.put('stories', oStory, function(iId){
        DEBUG && console.debug(iId);
      });
    });
  },

    createStoryWithId : function(iId, sTitle, sFeaturedImage){
    var self = this;
    var oStory = new Cotton.Model.Story();
    oStory.setId(iId);
    oStory.setTitle(sTitle);
    oStory.setFeaturedImage(sFeaturedImage);
    oStory.setLastVisitTime(new Date().getTime());
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
    }, function() {
      self._oDatabase.put('stories', oStory, function(iId){
        DEBUG && console.debug(iId);
      });
    });
  },

  createStoryFromList : function(sTitle, sFeaturedImage,
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
      var iLength = lHistoryItems.length;
      for (var i = 0; i < iLength; i++) {
        var dHistoryItem = lHistoryItems[i];

        var oHistoryItem = new Cotton.Model.HistoryItem();
        oHistoryItem.setLastVisitTime(dHistoryItem['iLastVisitTime']);
        oHistoryItem.setTitle(dHistoryItem['sTitle']);
        oHistoryItem.initUrl(dHistoryItem['sUrl']);
        self._oDatabase.putUnique('historyItems', oHistoryItem, function(iId){
          var _iId = iId;
          DEBUG && console.debug(_iId);
          lHistoryItemsId.push(_iId);
          DEBUG && console.debug(lHistoryItemsId.length + '' + lHistoryItems.length);
          if(lHistoryItemsId.length === iLength){
              var oStory = new Cotton.Model.Story();
              oStory.setTitle(sTitle);
              oStory.setFeaturedImage(sFeaturedImage);
              oStory.setLastVisitTime(new Date().getTime());
              oStory._lHistoryItemsId = lHistoryItemsId;
              var dBagOfWords = {};
              var lList = sTitle.split(' ');
              var jLength = lList.length;
              for (var j = 0; j < jLength; j++) {
                var sKeyword = lList[j];
                dBagOfWords[sKeyword] = 10;
              }
              oStory.dna().bagOfWords().setBag(dBagOfWords);
              self._oDatabase.put('stories', oStory, function(iStoryId){
                DEBUG && console.debug(iStoryId);
                DEBUG && console.debug('story created');

                //jLength is defined at previous loop
                for (var j = 0; j < jLength; j++) {
                  var sKeyword = lList[i]
                  var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
                  oSearchKeyword.addReferringStoryId(iStoryId);
                  self._oDatabase.putUnique('searchKeywords',oSearchKeyword,
                    function(){
                  });
                }
              });
          }
        });
      }
    });
  },

  addHistoryItemToStory : function(iStoryId, iHistoryItemId){
    var self = this;

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
    }, function() {
      self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        oStory.addHistoryItemId(iHistoryItemId);
        self._oDatabase.put('stories', oStory, function(){
          DEBUG && console.debug('historyItem added.');
        });
      });
    });
  },

  setStoryBagOfWords : function(iStoryId, dBagOfWords){
    var self = this;

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
      'stories' : Cotton.Translators.STORY_TRANSLATORS,
      'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
    }, function() {
      self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        oStory.dna().bagOfWords().setBag(dBagOfWords);
        self._oDatabase.put('stories', oStory, function(){
          DEBUG && console.debug('bagOfWords updated.');
          for(var sKey in dBagOfWords){
            var oSearchKeyword = new Cotton.Model.SearchKeyword(sKey);
            oSearchKeyword.addReferringStoryId(iStoryId);
            self._oDatabase.putUnique('searchKeywords', oSearchKeyword,
              function(){
                DEBUG && console.debug('searchKeywords updated.');
              });
          }
        });
      });
    });
  }

});

Cotton.MANAGER = new Manager();
})();
