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

  console.debug(lVisitItems);
  console.debug(iNbCluster);
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

/**
 * Given an array of visitItem labeled with a "clusterId", return a list of
 * list (cluster), that contains all visitItems with the same label.
 *
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Array.<Array.<visitItem>>} list of list that contains cluster.
 *
 */

Cotton.Algo.simpleCuster = function(lVisitItems, iNbCluster){
  var llClusters = [];

  // initialized
  for ( var i = 0; i < iNbCluster; i++) {
    llClusters[i] = [];
  }

  for ( var j = 0; j < lVisitItems.length; j++) {
      if (lVisitItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lVisitItems[j]['clusterId'] !== "NOISE") {
        llClusters[lVisitItems[j]['clusterId'] ].push(lVisitItems[j]);
      }
  }

  return _.reject(llClusters, function(lCluster) {
    return lCluster.length === 0;
  });

};

/**
 * Given an array of visitItem labeled with a "clusterId", return a list of
 * list (cluster), that contains all visitItems with the same label.
 *
 * @param {Array.
 *          <Object>} lVisitItems : array of DbRecordVisitItem (because they
 *          have been serialized by the worker.)
 * @param {int}
 *          iNbCluster
 * @returns {Array.<Array.<visitItem>>} list of list that contains cluster.
 *
 */

Cotton.Algo.elegantCuster = function(lVisitItems, iNbCluster){
  // TODO(rmoutard) : reject NOISE and UNCLASSIFIED
  return _.value(_.groupBy(lVisitItems, function(oItem){return oItem['clusterId'];}));
};
