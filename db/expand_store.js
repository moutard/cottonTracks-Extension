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
  for ( var i = 0; i < lStories.length; i++) {
    var oStory = lStories[lStories.length - 1 - i];
    oStore.put('stories', oStory, function(iId) {
      var _iId = iId;
      // TODO(rmoutard) : not really sustainanble.
      lStories[iCount].setId(iId);

      _.each(lStories[iCount].visitItemsId(), function(iVisitItemId){
        oStore.find('visitItems', 'id', iVisitItemId, function(oVisitItem){
          oVisitItem.setStoryId(_iId);
          oStore.put('visitItems', oVisitItem, function(){});
        });
      });
      if (iCount === iLength) {
        Cotton.DB.SearchKeywords.updateStoriesSearchKeywords(oStore, lStories);
        mCallBackFunction(oStore, lStories);
      }
      iCount += 1;
    });
  }
};

Cotton.DB.Stories.removeVisitItemInStory = function(oStore, iStoryId, iVisitItemId, mCallBackFunction){
  oStore.find('stories', 'id', iStoryId, function(oStory){
    oStory.removeVisitItem(iVisitItemId);
    oStore.put('stories', oStory, function(){
      console.log("visitItem deleted in the story");
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
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        var count = 0;
        var lStoriesTemp = lStories;
        for ( var i = 0; i < lStoriesTemp.length; i++) {
          var oStory = lStoriesTemp[i];
          this.findGroup('visitItems', 'id', oStory.visitItemsId(), function(
              lVisitItems) {

            lStoriesTemp[count].setVisitItems(lVisitItems);

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
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS

  }, function() {
    oStore.getXItems('stories', 10, 'fLastVisitTime', "PREV", function(lStories) {
        var count = 0;
        var lStoriesTemp = lStories;
        for ( var i = 0; i < lStoriesTemp.length; i++) {
          var oStory = lStoriesTemp[i];
          oStore.findGroup('visitItems', 'id', oStory.visitItemsId(), function(
              lVisitItems) {

            lStoriesTemp[count].setVisitItems(lVisitItems);

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
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS

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
    _.each(lStories, function(oStory){
        _.each(oStory.searchKeywords(), function(sKeyword){
          var oKeywordAndId = {
              'sKeyword': sKeyword,
              'iStoryId' : oStory.id()
          };
          lKeywordsAndId.push(oKeywordAndId);
        })
      });

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

            oStore.putUnique('searchKeywords', oSearchKeyword, function(iId){
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
 * VisitItems
 */
