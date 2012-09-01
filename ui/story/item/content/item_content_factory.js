'use strict';

Cotton.UI.Story.Item.Content.Factory = function(oItem) {

  var oUrl = new parseUrl(oItem._oVisitItem.url());
  oUrl.fineDecomposition();
  oItem._oVisitItem.oUrl = oUrl;
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");
  var sLastStringFromPathname = oUrl.pathname.split('/')[oUrl.pathname
      .split('/').length - 1];
  var sLastStringFromHyphen = sLastStringFromPathname.split('-')[sLastStringFromPathname
      .split('-').length - 1]

  if (reg.exec(oItem._oVisitItem.url())) {
    // Image
    console.log("Image");
    return new Cotton.UI.Story.Item.Content.Image(oItem);
  } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
    // Video - Youtube
    console.log("Video");
    return new Cotton.UI.Story.Item.Content.Video(oItem, "youtube",
        oUrl.dSearch['v']);
  } else if (oUrl.host === "vimeo.com" && oUrl.pathname.match(/(\/[0-9]+)$/)) {
    // Video - Vimeo
    return new Cotton.UI.Story.Item.Content.Video(oItem, "vimeo",
        sLastStringFromPathname);
  } else if (oUrl.host === "www.dailymotion.com"
      && oUrl.pathname.split('/')[1] == "video") {
    // Video - Dailymotion
    return new Cotton.UI.Story.Item.Content.Video(oItem, "dailymotion",
        oUrl.pathname.split('/')[2]);
  } else if (oUrl.host === "www.dailymotion.com" && oUrl.dHash['video']) {
    return new Cotton.UI.Story.Item.Content.Video(oItem, "dailymotion",
        oUrl.dHash['video']);
  } else if (oUrl.host.match(/^(maps\.google\.)/) && oUrl.pathname == "/maps") {
    return new Cotton.UI.Story.Item.Content.Map(oItem, oUrl);
  } else if (oUrl.host === "www.slideshare.net"
      && oUrl.pathname.match(/(\-[0-9]+)$/)) {
    // Slideshare
    console.log("Video");
    return new Cotton.UI.Story.Item.Content.Slideshow(oItem,
        sLastStringFromHyphen);
  } else if (oUrl.dSearch['q']) {
    // Search
    console.log("Search");
    return new Cotton.UI.Story.Item.Content.Search(oItem);
  } else {
    // Default
    console.log("Default");
    return new Cotton.UI.Story.Item.Content.Default(oItem);
  }
};