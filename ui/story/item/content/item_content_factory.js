'use strict';

/**
 * In function of the data stored in oItem._oHistoryItem, we know how the content
 * should be display. Using on the specific type of Item.Content
 *
 * @param oItem
 * @returns {Cotton.UI.Story.Item.Content}
 */
Cotton.UI.Story.Item.Content.Factory = function(oItem) {

  var oUrl = new UrlParser(oItem._oHistoryItem.url());
  oUrl.fineDecomposition();
  oItem._oHistoryItem._oUrl = oUrl;
  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");
  var sLastStringFromPathname = oUrl.pathname.split('/')[oUrl.pathname
      .split('/').length - 1];
  var sLastStringFromHyphen = sLastStringFromPathname.split('-')[sLastStringFromPathname
      .split('-').length - 1]

  if (reg.exec(oItem._oHistoryItem.url())) {
    // Image
    oItem.setItemType("image");
    return new Cotton.UI.Story.Item.Content.Image(oItem, "img");
  } else if (oUrl.pathname === "/imgres") {
    // Image, from google search image result.
    oItem.setItemType("image");
    return new Cotton.UI.Story.Item.Content.Image(oItem, "imgres");
  } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
    // Video - Youtube
    oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oItem, "youtube",
        oUrl.dSearch['v']);
  } else if (oUrl.hostname === "vimeo.com" && oUrl.pathname.match(/(\/[0-9]+)$/)) {
    // Video - Vimeo
    oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oItem, "vimeo",
        sLastStringFromPathname);
  } else if (oUrl.hostname === "www.dailymotion.com"
               && oUrl.pathname.split('/')[1] == "video") {
    // Video - Dailymotion
    oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oItem, "dailymotion",
        oUrl.pathname.split('/')[2]);
  } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
    oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oItem, "dailymotion",
        oUrl.dHash['video']);
  } else if (oUrl.hostname.match(/^(maps\.google\.)/) && oUrl.pathname == "/maps") {
    oItem.setItemType("map");
    return new Cotton.UI.Story.Item.Content.Map(oItem, oUrl);
  } else if (oUrl.dSearch['q']) {
    // Search
    oItem.setItemType("search");
    return new Cotton.UI.Story.Item.Content.Search(oItem);
  //TODO(rkorach) : include slideshare
  } else {
    // Default
    oItem.setItemType("default");
    return new Cotton.UI.Story.Item.Content.Default(oItem);
  }

};