'use strict';

/**
 * In function of the data stored in oItem._oHistoryItem, we know how the content
 * should be display. Using on the specific type of Item.Content
 *
 * @param oHistoryItem
 * @returns {Cotton.UI.Story.Item.Element}
 */
// FIXME(rmoutard) : create a real factory.
Cotton.UI.Story.Item.Factory = function(oHistoryItem, oDispatcher) {

  var oUrl = new UrlParser(oHistoryItem.url());
  oUrl.fineDecomposition();

   // Detect if it's an image.
  var reg = new RegExp(".(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$", "g");
  var sLastStringFromPathname = oUrl.pathname.split('/')[
    oUrl.pathname.split('/').length - 1];
  var sLastStringFromHyphen = sLastStringFromPathname.split('-')[
    sLastStringFromPathname.split('-').length - 1]


  if (reg.exec(oHistoryItem.url())) {
    // Image
    var sImageUrl = oHistoryItem.url();
    return new Cotton.UI.Story.Item.Image(sImageUrl, oHistoryItem, oDispatcher);
  } else if (oUrl.pathname === "/imgres") {
    // Image, from google search image result.
    var sImageUrl = oUrl.replaceHexa(oUrl.dSearch['imgurl']);
    return new Cotton.UI.Story.Item.Image(sImageUrl, oHistoryItem, oDispatcher);
  } else if (oUrl.searchImage) {
      // Image, from google search image result.
      var sImageUrl = oUrl.searchImage;
      return new Cotton.UI.Story.Item.Image(sImageUrl, oHistoryItem, oDispatcher);
  } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
    // Video - Youtube
    return new Cotton.UI.Story.Item.Video(oUrl.dSearch['v'], "youtube",
      oHistoryItem, oDispatcher);
  } else if (oUrl.hostname === "vimeo.com"
      && oUrl.pathname.match(/(\/[0-9]+)$/)) {
    // Video - Vimeo
    return new Cotton.UI.Story.Item.Video(sLastStringFromPathname, "vimeo",
      oHistoryItem, oDispatcher);
  } else if (oUrl.hostname === "www.dailymotion.com"
      && oUrl.pathname.split('/')[1] == "video") {
    // Video - Dailymotion
    return new Cotton.UI.Story.Item.Video(oUrl.pathname.split('/')[2],
      "dailymotion", oHistoryItem, oDispatcher);
  } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
    return new Cotton.UI.Story.Item.Video(oUrl.dHash['video'],
      "dailymotion", oHistoryItem, oDispatcher);
  } else if (oUrl.hostname.match(/^(maps\.google\.)/)
      && oUrl.pathname == "/maps") {
    var sMapUrl = oUrl.href;
    return new Cotton.UI.Story.Item.Map(sMapUrl, oHistoryItem, oDispatcher);
  } else if (oUrl.dSearch['q']) {
    // Search
    return new Cotton.UI.Story.Item.Search(oHistoryItem, oDispatcher);
    //TODO(rkorach) : include slideshare
  } else {
    // Default
    return new Cotton.UI.Story.Item.Article(oHistoryItem, oDispatcher);
  }

};

