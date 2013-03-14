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
  for ( var i = 0, iStoriesLength = lStories.length; i < iStoriesLength; i++) {

    var oStory = lStories[lStories.length - 1 - i];
    oStore.put('stories', oStory, function(iId) {
      var _iId = iId;
      // TODO(rmoutard) : not really sustainanble.
      lStories[iCount].setId(iId);

      for (var j = 0, lIds = lStories[iCount].historyItemsId(), iIdsLength = lIds.length;
        j < iIdsLength; j++) {

	  var iHistoryItemId = lIds[j];
          oStore.find('historyItems', 'id', iHistoryItemId, function(oHistoryItem){
            oHistoryItem.setStoryId(_iId);
            oStore.put('historyItems', oHistoryItem, function(){});
          });
      }
      if (iCount === iLength) {
        Cotton.DB.SearchKeywords.updateStoriesSearchKeywords(oStore, lStories);
        mCallBackFunction(oStore, lStories);
      }
      iCount += 1;
    });
  }
};

Cotton.DB.Stories.removeHistoryItemInStory = function(oStore, iStoryId, iHistoryItemId, mCallBackFunction){
  oStore.find('stories', 'id', iStoryId, function(oStory){
    oStory.removeHistoryItem(iHistoryItemId);
    oStore.put('stories', oStory, function(){
      console.log("historyItem deleted in the story");
      mCallBackFunction();
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
Cotton.DB.SearchKeywords.updateStoriesSearchKeywords = function(oStore, lStories){
    var lKeywordsAndId = [];
    for (var i = 0, iLength = lStories.length; i < iLength; i++) {
      var oStory = lStories[i];
      for (var j = 0, lKeywords = oStory.searchKeywords(),
        iKeywordsLength = lKeywords.length; j < iKeywordsLength; j++) {
          var sKeyword = lKeywords[j];
          var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
          oSearchKeyword.addReferringStoryId(oStory.id());
          oStore.putUniqueKeyword('searchKeywords', oSearchKeyword, function(iId){
            // Becarefull with asynchronous.
            console.log('keyword updated ' + sKeyword + ' storyId:' + oStory.id())
          });
      }
    }
};

Cotton.DB.SearchKeywords.updateStoriesSearchKeywords2 = function(oStore, lStories){
    var lKeywordsAndId = [];
    for (var i = 0, iLength = lStories.length; i < iLength; i++) {
      var oStory = lStories[i];
      for (var j = 0, lKeywords = oStory.searchKeywords(),
        iKeywordsLength = lKeywords.length; j < iKeywordsLength; j++) {
          var sKeywords = lKeywords[j];
          var oKeywordAndId = {
              'sKeyword': sKeyword,
              'iStoryId' : oStory.id()
          };
          lKeywordsAndId.push(oKeywordAndId);
        }
      }

      var f = function(lKeywordsAndId, i){
        var self = this;

        var _i = i;
        var oKeywordAndId = lKeywordsAndId[_i];
        if(oKeywordAndId){
          oStore.find('searchKeywords', 'sKeyword', oKeywordAndId['sKeyword'], function(oSearchKeyword){
            // If not find, oSearchKeyword is null.
            if(!oSearchKeyword) {
              oSearchKeyword = new Cotton.Model.SearchKeyword(oKeywordAndId['sKeyword']);
            }

            oSearchKeyword.addReferringStoryId(oKeywordAndId['iStoryId']);

            oStore.putUniqueKeyword('searchKeywords', oSearchKeyword, function(iId){
              // Becarefull with asynchronous.
              f(lKeywordsAndId, _i+1);
            });
          });
        }
      };

      f(lKeywordsAndId, 0);
};


/**
 * ----------------------------------------------------------------------------
 * HistoryItems
 */
