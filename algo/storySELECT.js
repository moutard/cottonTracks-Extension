'use strict';

Cotton.Algo.clusterStory = function(lHistoryItems, iNbCluster) {
  // 
  var lStories = new Array();

  // initialized
  for ( var i = 0; i <= iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }
  
  var bStoryUnderConstruction = true;
  // 
  for ( var j = 0; j < lHistoryItems.length; j++) {
    if (lHistoryItems[j].clusterId !== "UNCLASSIFIED"
        && lHistoryItems[j].clusterId !== "NOISE") {
      bStoryUnderConstruction = false;
      lStories[lHistoryItems[j].clusterId].addHistoryItem(lHistoryItems[j]);
    } else if(bStoryUnderConstruction){
      lStories[iNbCluster].addHistoryItem(lHistoryItems[j]);
    }
  }

  //console.log(lStories);
  return lStories;
};

Cotton.Algo.storySELECT = function(lStories) {
  // Select among all the stories the ones who should be display.

  var iMaxNumberOfStories = 5;
  var lDisplayStories = new Array();
  
  // return story under construction 
  lDisplayStories.push(lStories[lStories.length - 1]);

  // return the last one
  lDisplayStories.push(_.min(lStories, function(oItem) {
    return oItem.fLastVisitTime;
  }));

  lStories.sort(function(oStory1, oStory2) {
    return oStory2.length() - oStory1.length();
  });
  
  lDisplayStories = lDisplayStories.concat(lStories.slice(0, iMaxNumberOfStories));
  // return the lastOne
  //console.log(lDisplayStories);
  return lDisplayStories;
};
