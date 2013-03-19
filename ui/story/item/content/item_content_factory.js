'use strict';

/**
 * In function of the data stored in oItem._oHistoryItem, we know how the content
 * should be display. Using on the specific type of Item.Content
 *
 * @param oHistoryItem
 * @returns {Cotton.UI.Story.Item.Content}
 */
// FIXME(rmoutard) : create a real factory.
Cotton.UI.Story.Item.Content.Factory = function(oHistoryItem, oItem) {

  var oUrl = new UrlParser(oHistoryItem.url());
  oUrl.fineDecomposition();
  // FIXME(rmoutard) check if used.
  oHistoryItem._oUrl = oUrl;

  // Detect if it's an image.
  var reg = new RegExp(".(jpg|png|gif)$", "g");
  var sLastStringFromPathname = oUrl.pathname.split('/')[
    oUrl.pathname.split('/').length - 1];
  var sLastStringFromHyphen = sLastStringFromPathname.split('-')[
    sLastStringFromPathname.split('-').length - 1]

  if (reg.exec(oHistoryItem.url())) {
    // Image
    //oItem.setItemType("image");
    return new Cotton.UI.Story.Item.Content.Image(oHistoryItem, "img", oItem);
  } else if (oUrl.pathname === "/imgres") {
    // Image, from google search image result.
    //oItem.setItemType("image");
    return new Cotton.UI.Story.Item.Content.Image(oHistoryItem, "imgres", oItem);
  } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
    // Video - Youtube
    //oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oHistoryItem, "youtube",
      oUrl.dSearch['v']);
  } else if (oUrl.hostname === "vimeo.com"
      && oUrl.pathname.match(/(\/[0-9]+)$/)) {
    // Video - Vimeo
    //oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oHistoryItem, "vimeo",
      sLastStringFromPathname, oItem);
  } else if (oUrl.hostname === "www.dailymotion.com"
      && oUrl.pathname.split('/')[1] == "video") {
    // Video - Dailymotion
    //oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oHistoryItem, "dailymotion",
      oUrl.pathname.split('/')[2], oItem);
  } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
    //oItem.setItemType("video");
    return new Cotton.UI.Story.Item.Content.Video(oHistoryItem, "dailymotion",
      oUrl.dHash['video'], oItem);
  } else if (oUrl.hostname.match(/^(maps\.google\.)/)
      && oUrl.pathname == "/maps") {
    //oItem.setItemType("map");
    return new Cotton.UI.Story.Item.Content.Map(oHistoryItem, oUrl, oItem);
  } else if (oUrl.dSearch['q']) {
    // Search
    //oItem.setItemType("search");
    return new Cotton.UI.Story.Item.Content.Search(oHistoryItem, oItem);
    //TODO(rkorach) : include slideshare
  } else {
    // Default
    //oItem.setItemType("default");
    return new Cotton.UI.Story.Item.Content.Default(oHistoryItem, oItem);
  }

};
