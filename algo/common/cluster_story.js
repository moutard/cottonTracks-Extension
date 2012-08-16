'use strict';
/**
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem
 * @param {int}
 *          iNbCluster
 */
Cotton.Algo.clusterStory = function(lVisitItems, iNbCluster) {
  // Create an Array of stories with lVisitItems
  // lVisitItems should be sorted by fLastvisitTime

  /**
   * Rq:can't put this directly on the worker because the return is serialized.
   */
  console.debug(lVisitItems);
  console.debug(iNbCluster);
  var lStories = [];
  var oStoryUnderConstruction = new Cotton.Model.Story();

  // initialized
  if (lVisitItems.length === 0 || iNbCluster === 0) {
    return {
      'stories' : lStories,
      'storyUnderConstruction' : oStoryUnderConstruction
    };
  }

  // inferior or equal is needed <= /
  for ( var i = 0; i <= iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }

  var bStoryUnderConstruction = true;
  //
  for ( var j = 0; j < lVisitItems.length; j++) {
    if (lVisitItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lVisitItems[j]['clusterId'] !== "NOISE") {
      bStoryUnderConstruction = false;
      lStories[lVisitItems[j]['clusterId']]
          .addDbRecordVisitItem(lVisitItems[j]);

      // Set story title.
      if (lStories[lVisitItems[j]['clusterId']].title() === ""
          || lStories[lVisitItems[j]['clusterId']]['temptitle'] === true) {
        if (lVisitItems[j]['lQueryWords'].length !== 0) {
          lStories[lVisitItems[j]['clusterId']]
              .setTitle(lVisitItems[j]['lQueryWords'].join(" "));
          lStories[lVisitItems[j]['clusterId']]['temptitle'] = false;
        } else if (lVisitItems[j]['sTitle'] !== "") {
          lStories[lVisitItems[j]['clusterId']]
              .setTitle(lVisitItems[j]['sTitle']);
          lStories[lVisitItems[j]['clusterId']]['temptitle'] = true;
        }
      }

      // Set Featured image
      var reg = new RegExp(".(jpg|png|gif)$", "g");
      if (reg.exec(lVisitItems[j]['sUrl'])) {
        lStories[lVisitItems[j]['clusterId']]
            .setFeaturedImage(lVisitItems[j]['sUrl']);
      }

    } else if (bStoryUnderConstruction) {
      // remove the noise
      oStoryUnderConstruction.addDbRecordVisitItem(lVisitItems[j]);
    }
  }

  lStories = _.reject(lStories, function(oStory) {
    return oStory.lastVisitTime() === 0;
  });

  /**
   * Compute title and featured Image Can't use this for the moment because
   * addDbRecordVisitItem don't put a Cotton.Model.VisitItem.
   */
  for ( var k = 0, oStory; oStory = lStories[k]; k++) {
    // oStory.computeTitle();
    // oStory.computeFeaturedImage();
    console.log(oStory);
  }
  // the lStories[iNbcluster] is the story under constructrion
  // remove it
  return {
    'stories' : lStories,
    'storyUnderConstruction' : oStoryUnderConstruction
  };
};
