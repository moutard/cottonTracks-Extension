'use strict';

/**
 * Given an array of visitItem labeled with a "clusterId", return a list of
 * stories, that contains all visitItems with the same label.
 * 
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Object} dStories list of all the stories.
 * 
 * 
 */
Cotton.Algo.clusterStory = function(lVisitItems, iNbCluster) {
  DEBUG && console.debug("cluster story")
  DEBUG && console.debug(lVisitItems);
  DEBUG && console.debug(iNbCluster);
  var lStories = [];
  // TODO(rmoutard) : storyUnderConstruction is usless now.
  var oStoryUnderConstruction = new Cotton.Model.Story();

  // There is nothing to cluster.
  if (lVisitItems.length === 0 || iNbCluster === 0) {
    return {
      'stories' : lStories,
      'storyUnderConstruction' : oStoryUnderConstruction
    };
  }

  // initialized
  for ( var i = 0; i < iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }

  var bStoryUnderConstruction = true;

  for ( var j = 0; j < lVisitItems.length; j++) {
    if (lVisitItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lVisitItems[j]['clusterId'] !== "NOISE") {

      //
      bStoryUnderConstruction = false;

      // Add the visitItem in the corresponding story.
      lStories[lVisitItems[j]['clusterId']]
          .addDbRecordVisitItem(lVisitItems[j]);
      // If the visitItem was already in a story change the story Id. So when
      // you will put the story, it will be modified.
      if (lVisitItems[j]['sStoryId'] !== "UNCLASSIFIED") {
        lStories[lVisitItems[j]['clusterId']].setId(lVisitItems[j]['sStoryId']);
      }

      // Set story title.
      if (lStories[lVisitItems[j]['clusterId']].title() === ""
          || lStories[lVisitItems[j]['clusterId']]['temptitle'] === true) {
        // first condition indicates that title is not defined
        // second condition indicates we can find a better title
        // in both case we recompute the title.
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
      if (lStories[lVisitItems[j]['clusterId']].featuredImage() === ""
          || lStories[lVisitItems[j]['clusterId']]['tempimage'] === true) {
        // first condition indicates that imageFeatured is not defined
        // second condition indicates we can find a better image
        // in both case we recompute the title.
        var reg = new RegExp(".(jpg|png|gif)$", "g");
        var oUrl = new parseUrl(lVisitItems[j]['sUrl']);
        oUrl.fineDecomposition();
        if (reg.exec(lVisitItems[j]['sUrl'])) {
        	//Image
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage(lVisitItems[j]['sUrl']);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.pathname === "/imgres") {
        	//Image from google image search
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage(oUrl.dSearch['imgurl']);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (lVisitItems[j]['oExtractedDNA']['sImageUrl'] !== "") {
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage(lVisitItems[j]['oExtractedDNA']['sImageUrl']);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = true;
        }
      }

    } else if (bStoryUnderConstruction) {
      oStoryUnderConstruction.addDbRecordVisitItem(lVisitItems[j]);
    }
  }

  lStories = _.reject(lStories, function(oStory) {
    return oStory.lastVisitTime() === 0;
  });

  return {
    'stories' : lStories,
    'storyUnderConstruction' : oStoryUnderConstruction
  };
};
