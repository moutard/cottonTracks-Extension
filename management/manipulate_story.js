'use strict';
(function(){
var Manager = Class.extend({
  init: function(){
  },

  createStory : function(sTitle, sFeaturedImage){
    var self = this;
    var oStory = new Cotton.Model.Story({});
    oStory.setTitle(sTitle);
    oStory.setFeaturedImage(sFeaturedImage);
    oStory.setLastVisitTime(new Date().getTime());
    self._oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ct', {
      'stories' : Cotton.Model.Story,
    }, function() {
      self._oDatabase.put('stories', oStory, function(iId){
        DEBUG && console.debug(iId);
      });
    });
  },

    createStoryWithId : function(iId, sTitle, sFeaturedImage){
    var self = this;
    var oStory = new Cotton.Model.Story({});
    oStory.setId(iId);
    oStory.setTitle(sTitle);
    oStory.setFeaturedImage(sFeaturedImage);
    oStory.setLastVisitTime(new Date().getTime());
    self._oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ct', {
      'stories' : Cotton.Model.Story,
    }, function() {
      self._oDatabase.put('stories', oStory, function(iId){
        DEBUG && console.debug(iId);
      });
    });
  },

  createStoryFromList : function(sTitle, sFeaturedImage,
    lHistoryItems){
    var self = this;
    var oStory = new Cotton.Model.Story({});
    oStory.setTitle(sTitle);
    oStory.setFeaturedImage(sFeaturedImage);
    oStory.setLastVisitTime(new Date().getTime());
    var lHistoryItemsId = [];
    self._oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ct', {
      'searchKeywords': Cotton.Model.SearchKeyword,
      'historyItems': Cotton.Model.HistoryItem,
      'stories': Cotton.Model.Story
    }, function() {
      for(var i = 0, dHistoryItem; dHistoryItem = lHistoryItems[i]; i++){
        //var oTranslator = self._oDatabase._translatorForDbRecord('historyItems', dHistoryItem);
        //var oHistoryItem = oTranslator.
        var oHistoryItem = new Cotton.Model.HistoryItem({});
        oHistoryItem.setLastVisitTime(dHistoryItem['iLastVisitTime']);
        oHistoryItem.setTitle(dHistoryItem['sTitle']);
        oHistoryItem.initUrl(dHistoryItem['sUrl']);
        self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId){
          var _iId = iId;
          DEBUG && console.debug(_iId);
          lHistoryItemsId.push(_iId);
          DEBUG && console.debug(lHistoryItemsId.length + '' + lHistoryItems.length);
          if(lHistoryItemsId.length === lHistoryItems.length){
              var oStory = new Cotton.Model.Story({});
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
                DEBUG && console.debug(iStoryId);
                DEBUG && console.debug('story created');

                for(var i=0, sKeyword; sKeyword = lList[i]; i++){
                  var oSearchKeyword = new Cotton.Model.SearchKeyword({
                    'sKeyword': sKeyword
                  });
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
  },

  addHistoryItemToStory : function(iStoryId, iHistoryItemId){
    var self = this;

    self._oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ct', {
      'stories' : Cotton.Model.Story,
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

    self._oDatabase = new Cotton.DB.IndexedDB.WrapperModel('ct', {
      'stories' : Cotton.Model.Story,
      'searchKeywords' : Cotton.Model.SearchKeyword,
    }, function() {
      self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        oStory.dna().bagOfWords().setBag(dBagOfWords);
        self._oDatabase.put('stories', oStory, function(){
          DEBUG && console.debug('bagOfWords updated.');
          for(var sKey in dBagOfWords){
            var oSearchKeyword = new Cotton.Model.SearchKeyword({
              'sKeyword': sKey
            });
            oSearchKeyword.addReferringStoryId(iStoryId);
            self._oDatabase.putUniqueKeyword('searchKeywords', oSearchKeyword,
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
