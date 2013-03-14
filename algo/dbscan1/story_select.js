'use strict';

Cotton.Algo.storySELECT = function(lStories, bUseRelevance) {
  // Select among all the stories the ones who should be display.
  var iMaxNumberOfStories = Cotton.Config.Parameters.iMaxNumberOfStories;
  if (bUseRelevance) {
    for ( var i = 1, iLength = lStories.length; i < iLength; i++) {
      lStories[i].computeRelevance();
    }
    lStories.sort(function(oStoryA, oStoryB) {
      // >0 => B lower than A
      // The more relevant at the beginning.
      return oStoryB.relevance() - oStoryA.relevance();
    })

    // return the most relevant stories
    return lStories.slice(0, iMaxNumberOfStories);
  } else {
    var iMaxNumberOfStories = 5;
    var lDisplayStories = new Array();

    // return story under construction
    lDisplayStories.push(lStories[lStories.length - 1]);

    // return the last one
    lDisplayStories.push(_.max(lStories, function(oItem) {
      return oItem.lastVisitTime();
    }));

    lStories.sort(function(oStory1, oStory2) {
      return oStory2.length() - oStory1.length();
    });

    // return the most longuest Stories
    lDisplayStories = lDisplayStories.concat(lStories.slice(0,
        iMaxNumberOfStories));

    return lDisplayStories;
  }

};
