'use strict';

Cotton.UI.Story.ItemFactory = function(oVisitItem) {

  var oUrl = new parseUrl(oVisitItem.url());
  oUrl.fineDecomposition();
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");

  if (reg.exec(oVisitItem.url())) {
    return new Cotton.UI.Story.ImageItem(oVisitItem);
  } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
    return new Cotton.UI.Story.VideoItem(oVisitItem, oUrl.dSearch['v']);
  } else {
    return new Cotton.UI.Story.DefaultItem(oVisitItem);
  }
};