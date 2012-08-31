'use strict';

/**
 * Add usefull function to expand store prototype.
 */

/**
 * Stories
 */
Cotton.DB.Stories = {};

Cotton.DB.Stories.addStories = function(oStore, lStories, mCallBackFunction) {
  console.log(lStories);
  console.debug("DB - add stories");
  var iLength = lStories.length - 1;
  var iCount = 0;
  for ( var i = 0; i < lStories.length; i++) {
    var oStory = lStories[lStories.length - 1 - i];
    oStore.put('stories', oStory, function(iId) {
      oStory.setId(iId);
      if (iCount === iLength) {
        mCallBackFunction(oStore, lStories);
      }
      iCount += 1;
    });
  }
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
              console.log('forFwouts');
              console.log(lStoriesTemp);
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
 * VisitItems
 */
