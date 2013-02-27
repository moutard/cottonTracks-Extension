'use strict';

/**
 * In function of the data stored in oItem._oVisitItem, we know how the content
 * should be display. Using on the specific type of Item.Content
 *
 * @param oItem
 * @returns {Cotton.UI.Story.Item.Content}
 */
Cotton.UI.Story.Item.Content.Factory = function(oItem) {

  var oUrl = new UrlParser(oItem._oVisitItem.url());
  oUrl.fineDecomposition();
  oItem._oVisitItem._oUrl = oUrl;
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");
  var sLastStringFromPathname = oUrl.pathname.split('/')[oUrl.pathname
      .split('/').length - 1];
  var sLastStringFromHyphen = sLastStringFromPathname.split('-')[sLastStringFromPathname
      .split('-').length - 1]

  if (reg.exec(oItem._oVisitItem.url())) {
    // Image
    return new Cotton.UI.Story.Item.Content.Image(oItem, "img");
  } else if (oUrl.pathname === "/imgres") {
    // Image, from google search image result.
    return new Cotton.UI.Story.Item.Content.Image(oItem, "imgres");
  } else if (oUrl.host === "www.youtube.com" && oUrl.dSearch['v']) {
    // Video - Youtube
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
  } else if (oUrl.dSearch['q']) {
    // Search
    return new Cotton.UI.Story.Item.Content.Search(oItem);
  //TODO(rkorach) : include slideshare
  } else {
    // Default
    return new Cotton.UI.Story.Item.Content.Default(oItem);
  }
};
