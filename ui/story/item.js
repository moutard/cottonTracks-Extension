'use strict';

Cotton.UI.Story.ItemFactory = function(oVisitItem) {

  var oUrl = new parseUrl(oVisitItem.url());
  oUrl.fineDecomposition();
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");

  if (reg.exec(oVisitItem.url())) {
    return new Cotton.UI.Story.ImageItem(oVisitItem);
  } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
    return new Cotton.UI.Story.VideoItem(oVisitItem, "youtube", oUrl.dSearch['v']);
  } else if (oUrl.host === "vimeo.com" && oUrl.pathname.substr(1).match(/[0-9]+/)){
  	return new Cotton.UI.Story.VideoItem(oVisitItem, "vimeo", oUrl.substr(1));
  } else if (oUrl.host === "www.dailymotion.com" && oUrl.pathname.split('/')[1] == "video"){
  	return new Cotton.UI.Story.VideoItem(oVisitItem, "dailymotion", oUrl.pathname.split('/')[2]);  	
  } else {
    return new Cotton.UI.Story.DefaultItem(oVisitItem);
  }
};