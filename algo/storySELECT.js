'use strict';

Cotton.Algo.clusterStory = function(lHistoryItems, iNbCluster) {
  // 
  var lStories = new Array();

  // initialized
  for ( var i = 0; i <= iNbCluster; i++) {
    lStories[i] = new Story();
  }

  // 
  for ( var j = 0; j < lHistoryItems.length; j++) {
    if (lHistoryItems[j].clusterId !== "UNCLASSIFIED"
        && lHistoryItems[j].clusterId !== "NOISE") {
      lStories[lHistoryItems[j].clusterId].addHistoryItem(lHistoryItems[j]);
    }
  }

  console.log(lStories);
  return lStories;
};

Cotton.Algo.storySELECT = function(lStories) {
  // Select among all the stories the ones who should be display.

  var iMaxNumberOfStories = 5;
  var lDisplayStories = new Array();

  // return the last one
  lDisplayStories.push(_.min(lStories, function(oItem) {
    return oItem.fLastVisitTime;
  }));

  lStories.sort(function(oStory1, oStory2) {
    return oStory1.length() - oStory2.length();
  });

  lDisplayStories.concat(lStories.slice(0, 5));
  // return the lastOne
  console.log(lDisplayStories);
  return lDisplayStories;
};