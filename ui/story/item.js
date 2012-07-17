'use strict';

Cotton.UI.Story.ItemFactory = function(oVisitItem) {

  var oUrl = new parseUrl(oVisitItem.url());
  oUrl.fineDecomposition();
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");
  var sLastString = oUrl.pathname.split(oUrl.pathname.split('/').length-1);

  if (reg.exec(oVisitItem.url())) {
    return new Cotton.UI.Story.ImageItem(oVisitItem);
  } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
    return new Cotton.UI.Story.VideoItem(oVisitItem, "youtube", oUrl.dSearch['v']);
  } else if (oUrl.host === "vimeo.com" && sLastString.match(/[0-9]+/)) {
  	return new Cotton.UI.Story.VideoItem(oVisitItem, "vimeo", sLastString);
  } else if (oUrl.host === "www.dailymotion.com" && oUrl.pathname.split('/')[1] == "video") {
  	return new Cotton.UI.Story.VideoItem(oVisitItem, "dailymotion", oUrl.pathname.split('/')[2]);  	
  } else if (oUrl.host ==="www.dailymotion.com" && oUrl.dHash['video']) {
  	return new Cotton.UI.Story.VideoItem(oVisitItem, "dailymotion", oUrl.dHash['video']);
  } else {
    return new Cotton.UI.Story.DefaultItem(oVisitItem);
  }
};