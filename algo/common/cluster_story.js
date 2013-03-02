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
        var oUrl = new UrlParser(lVisitItems[j]['sUrl']);
        oUrl.fineDecomposition();
        if (reg.exec(lVisitItems[j]['sUrl'])) {
        	//Image
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage(lVisitItems[j]['sUrl']);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.pathname === "/imgres") {
          //Image from google image search
    	  oUrl.fineDecomposition();
		  var sSearchImgUrl = oUrl.replaceHexa(oUrl.dSearch['imgurl']);
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage(sSearchImgUrl);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
        	//Youtube video
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage("http://img.youtube.com/vi/" + oUrl.dSearch['v'] + "/mqdefault.jpg");
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.host === "vimeo.com" && oUrl.pathname.match(/(\/[0-9]+)$/)) {
        	//Vimeo video
          var thumbnail_src;
          $.ajax({
              url: 'http://vimeo.com/api/v2/video/' + sLastStringFromPathname + '.json',
              dataType: 'json',
              async: false,
              success: function(data) {
              thumbnail_src = data[0].thumbnail_large;
            }
          });
          lStories[lVisitItems[j]['clusterId']].setFeaturedImage(thumbnail_src);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.host === "www.dailymotion.com" && oUrl.pathname.split('/')[1] == "video") {
        	//Dailymotion video (from video page)
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.host + "/thumbnail" + oUrl.pathname);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.host === "www.dailymotion.com" && oUrl.dHash['video']) {
        	//Dailymotionvideo (from channel page)
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.host + "/thumbnail/video/" + dHash['video']);
          lStories[lVisitItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.host.match(/^(maps\.google\.)/) && oUrl.pathname == "/maps") {
        	//Google maps
          lStories[lVisitItems[j]['clusterId']]
              .setFeaturedImage("http://maps.googleapis.com/maps/api/staticmap?center=" + oUrl.dSearch['q'] +
              "&sensor=false&size=200x120&maptype=roadmap&markers=color:blue%7C" + oUrl.dSearch['q']);
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
