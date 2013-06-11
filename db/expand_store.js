'use strict';

/**
 * Add usefull function to expand store prototype.
 */

/**
 * Stories
 */
Cotton.DB.Stories = {};

Cotton.DB.Stories.addStories = function(oStore, lStories, mCallBackFunction) {

  DEBUG && console.debug("DB - add stories");
  DEBUG && console.debug(lStories);

  var iLength = lStories.length - 1;
  var iCount = 0;
  var _lStories = [];
  if (lStories.length === 0 && mCallBackFunction){
    mCallBackFunction(oStore, _lStories);
  }
  for ( var i = 0, iStoriesLength = lStories.length; i < iStoriesLength; i++) {

    var oStory = lStories[iLength - i];
    oStore.put('stories', oStory, function(iId, _oStory) {
      var _iId = iId;
      _lStories.push(_oStory);
      _oStory.setId(iId);

      Cotton.DB.SearchKeywords.updateSearchKeywordsForOneStory(oStore, _oStory, function(lKeywordsIds){
        if (_oStory.historyItemsId().length === 0 && iCount === iLength && mCallBackFunction){
          mCallBackFunction(oStore, _lStories);
        } else {
          for (var j = 0, lIds = _oStory.historyItemsId(), iIdsLength = lIds.length;
            j < iIdsLength; j++) {
  	          var iHistoryItemId = lIds[j];
              oStore.find('historyItems', 'id', iHistoryItemId, function(oHistoryItem){
                oHistoryItem.setStoryId(_iId);
                oStore.put('historyItems', oHistoryItem, function(){});
              });
              if (iCount === iLength && j === iIdsLength - 1 && mCallBackFunction) {
                mCallBackFunction(oStore, _lStories);
              }
          }
        }
        // iCount incremented afterwards because iLength = lStories.length - 1 !
        iCount ++;
      });
    });
  }
};

Cotton.DB.Stories.removeHistoryItemInStory = function(oStore, iStoryId, iHistoryItemId, mCallBackFunction){
  var bStoryReady, bItemReady;
  oStore.find('stories', 'id', iStoryId, function(oStory){
    oStory.removeHistoryItem(iHistoryItemId);
    oStore.put('stories', oStory, function(){
      bStoryReady = true;
      if (bItemReady && mCallBackFunction){
        mCallBackFunction();
      }
    });
  });
  oStore.find('historyItems', 'id', iHistoryItemId, function(oHistoryItem){
    oHistoryItem.removeStoryId();
    oStore.put('historyItems', oHistoryItem, function(){
      bItemReady = true;
      if (bStoryReady && mCallBackFunction){
        mCallBackFunction();
      }
    });
  });
};

Cotton.DB.Stories.getRange = function(iX, iY, mCallBackFunction) {
  new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
    this.getXYItems('stories', iX, iY, 'fLastVisitTime', "PREV", function(
        lStories) {

      new Cotton.DB.Store('ct', {
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
      }, function() {
        var count = 0;
        var lStoriesTemp = lStories;
        for ( var i = 0, iLength = lStoriesTemp.length; i < iLength; i++) {
          var oStory = lStoriesTemp[i];
          this.findGroup('historyItems', 'id', oStory.historyItemsId(), function(
              lHistoryItems) {

            lStoriesTemp[count].setHistoryItems(lHistoryItems);

            if (count == (lStoriesTemp.length - 1)) {
              mCallBackFunction(lStoriesTemp);
            }
            count++;
          });
        }
      });
    });
  });
};

Cotton.DB.Stories.getXStories2 = function(iX, mCallBackFunction) {
  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS

  }, function() {
    oStore.getXItems('stories', 10, 'fLastVisitTime', "PREV", function(lStories) {
        var count = 0;
        var lStoriesTemp = lStories;
        for ( var i = 0, iLength = lStoriesTemp.length; i < iLength; i++) {
          var oStory = lStoriesTemp[i];
          oStore.findGroup('historyItems', 'id', oStory.historyItemsId(), function(
              lHistoryItems) {

            lStoriesTemp[count].setHistoryItems(lHistoryItems);

            if (count == (lStoriesTemp.length - 1)) {
              mCallBackFunction(lStoriesTemp);
            }
            count++;
          });
        }
      });
  });
};

Cotton.DB.Stories.getXStories = function(iX, mCallBackFunction) {
  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS

  }, function() {
    oStore.getXItems('stories', 10, 'fLastVisitTime', "PREV", function(lStories) {
        mCallBackFunction(lStories);
      });
  });
};

/**
 * ----------------------------------------------------------------------------
 * SearchKeywords
 */
Cotton.DB.SearchKeywords = {};

Cotton.DB.SearchKeywords.updateSearchKeywordsForOneStory = function(oStore, oStory, mCallback){
  var lKeywordsAndId = [];
  var iLength = oStory.searchKeywords().length;
  var iCount = 0;
  var lKeywordsIds = [];
  for (var j = 0, lKeywords = oStory.searchKeywords(),
    iKeywordsLength = lKeywords.length; j < iKeywordsLength; j++) {
      var sKeyword = lKeywords[j];
      var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
      oSearchKeyword.addReferringStoryId(oStory.id());
      oStore.putUniqueKeyword('searchKeywords', oSearchKeyword, function(iId){
        // Be careful with asynchronous.
        DEBUG && console.debug('keyword updated with id: ' + iId + ' storyId:' + oStory.id());
        lKeywordsIds.push(iId);
        iCount++;
        if (iCount === iLength && mCallback){
          mCallback.call(this, lKeywordsIds);
        }
      });
  }
};
