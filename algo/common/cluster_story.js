'use strict';

/**
 * Given an array of historyItems labeled with a "clusterId", return a list of
 * stories, that contains all historyItems with the same label.
 *
 * @param {Array.<Object>} lHistoryItems : array of DbRecordHistoryItem (because
 *        they have been serialized by the worker.)
 * @param {int} iNbCluster
 * @returns {Array.<Cotton.Model.Story} list of all the stories that has at
 *            least one element.
 *
 */
Cotton.Algo.clusterStory = function(lHistoryItems, iNbCluster) {
  DEBUG && console.debug("cluster story")
  DEBUG && console.debug(lHistoryItems);
  DEBUG && console.debug(iNbCluster);
  var lStories = [];

  // There is nothing to cluster.
  if (lHistoryItems.length === 0 || iNbCluster === 0) {
    return lStories;
  }

  // Initialize with empty stories.
  for ( var i = 0; i < iNbCluster; i++) {
    lStories[i] = new Cotton.Model.Story();
  }

  var jLength = lHistoryItems.length;
  for ( var j = 0; j < jLength; j++) {

    // If the clusterId is a number, then it goes to the corresponding stories.
    if (lHistoryItems[j]['clusterId'] !== "UNCLASSIFIED"
        && lHistoryItems[j]['clusterId'] !== "NOISE") {

      // Add the historyItem in the corresponding story.
      lStories[lHistoryItems[j]['clusterId']]
          .addDbRecordHistoryItem(lHistoryItems[j]);
      // If the historyItem was already in a story change the story Id. So when
      // you will put the story, it will be modified.
      if (lHistoryItems[j]['sStoryId'] !== "UNCLASSIFIED") {
        lStories[lHistoryItems[j]['clusterId']].setId(lHistoryItems[j]['sStoryId']);
      }

      // Set story bagOfWords.
      for (var dWord in lHistoryItems[j]['oExtractedDNA']['dBagOfWords']){
        lStories[lHistoryItems[j]['clusterId']].dna().bagOfWords().addWord(
          dWord, lHistoryItems[j]['oExtractedDNA']['dBagOfWords'][dWord]);
      }

      // Set story title.
      if (lStories[lHistoryItems[j]['clusterId']].title() === ""
          || lStories[lHistoryItems[j]['clusterId']]['temptitle'] === true) {
        // first condition indicates that title is not defined
        // second condition indicates we can find a better title
        // in both case we recompute the title.
        if (lHistoryItems[j]['oExtractedDNA']['lQueryWords'].length !== 0) {
          lStories[lHistoryItems[j]['clusterId']]
              .setTitle(lHistoryItems[j]['oExtractedDNA']['lQueryWords'].join(" "));
          lStories[lHistoryItems[j]['clusterId']]['temptitle'] = false;
        } else if (lStories[lHistoryItems[j]['clusterId']].searchKeywords().length
          && lStories[lHistoryItems[j]['clusterId']].searchKeywords().length > 0){
            lStories[lHistoryItems[j]['clusterId']].setTitle(
              lStories[lHistoryItems[j]['clusterId']].searchKeywords().join(' ')
            );
            lStories[lHistoryItems[j]['clusterId']]['temptitle'] = true;
        } else if (lHistoryItems[j]['sTitle'] !== "") {
          lStories[lHistoryItems[j]['clusterId']]
              .setTitle(lHistoryItems[j]['sTitle']);
          lStories[lHistoryItems[j]['clusterId']]['temptitle'] = true;
        }
      }

      // Set Featured image
      if (lStories[lHistoryItems[j]['clusterId']].featuredImage() === ""
          || lStories[lHistoryItems[j]['clusterId']]['tempimage'] === true) {
        // first condition indicates that imageFeatured is not defined
        // second condition indicates we can find a better image
        // in both case we recompute the title.
        var reg = new RegExp("\.(jpg|jpeg|png|gif)$", "gi");
        var oUrl = new UrlParser(lHistoryItems[j]['sUrl']);
        oUrl.fineDecomposition();
        var fileReg = /File\:/ig;
        if (reg.exec(lHistoryItems[j]['sUrl']) && !oUrl.pathname.match(fileReg)) {
        	//Image
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(lHistoryItems[j]['sUrl']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.pathname === "/imgres") {
          //Image from google image search
    	  oUrl.fineDecomposition();
		  var sSearchImgUrl = oUrl.replaceHexa(oUrl.dSearch['imgurl']);
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(sSearchImgUrl);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if(oUrl.searchImage){
          var sSearchImgUrl = oUrl.searchImage;
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(sSearchImgUrl);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
        	//Youtube video
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://img.youtube.com/vi/" + oUrl.dSearch['v'] + "/mqdefault.jpg");
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.pathname.split('/')[1] == "video") {
        	//Dailymotion video (from video page)
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.hostname + "/thumbnail" + oUrl.pathname);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
        	//Dailymotionvideo (from channel page)
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://" + oUrl.hostname + "/thumbnail/video/" + oUrl.dHash['video']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname.match(/^(maps\.google\.)/) && oUrl.pathname == "/maps") {
        	//Google maps
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://maps.googleapis.com/maps/api/staticmap?center=" + oUrl.dSearch['q'] +
              "&sensor=false&size=300x300&maptype=roadmap&markers=color:blue%7C" + oUrl.dSearch['q']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.google.com" && oUrl.pathname == "/maps") {
        	//Google maps
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage("http://maps.googleapis.com/maps/api/staticmap?center=" + oUrl.dSearch['q'] +
              "&sensor=false&size=300x300&maptype=roadmap&markers=color:blue%7C" + oUrl.dSearch['q']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
        } else if (oUrl.hostname === "www.google.com" && oUrl.pathname == "/maps/preview") {
          var sMapCode = oUrl.dSearch['q'] || oUrl.dHash['!q'];
          if (sMapCode){
          	//Google maps
            lStories[lHistoryItems[j]['clusterId']]
                .setFeaturedImage("http://maps.googleapis.com/maps/api/staticmap?center=" + sMapCode +
                "&sensor=false&size=300x300&maptype=roadmap&markers=color:blue%7C" + sMapCode);
            lStories[lHistoryItems[j]['clusterId']]['tempimage'] = false;
          } else {
            lStories[lHistoryItems[j]['clusterId']]['tempimage'] = true;
          }
        } else if (lHistoryItems[j]['oExtractedDNA']['sImageUrl'] !== "") {
          lStories[lHistoryItems[j]['clusterId']]
              .setFeaturedImage(lHistoryItems[j]['oExtractedDNA']['sImageUrl']);
          lStories[lHistoryItems[j]['clusterId']]['tempimage'] = true;
        }
      }
    }
  }

  lStories = _.reject(lStories, function(oStory) {
    return oStory.lastVisitTime() === 0;
  });

  return lStories;
};