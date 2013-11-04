'use strict';

/**
 * In function of the data stored in oHistoryItem, we know how the content
 * should be display. Using one of the specific type of Card.Content
 *
 * @param oHistoryItem
 * @returns {Cotton.UI.Stand.Story.Card.Card}
 */
// FIXME(rmoutard) : create a real factory.
Cotton.UI.Stand.Story.Card.Factory = Class.extend({

  init : function () {

  },

  get : function(oHistoryItem, oGlobalDispatcher) {

    var oUrl = new UrlParser(oHistoryItem.url());
    oUrl.fineDecomposition();
    
     // Detect if it's an image.
    var reg = new RegExp("\.(jpg|jpeg|png|gif)$", "gi");
    var sLastStringFromPathname = oUrl.pathname.split('/')[
      oUrl.pathname.split('/').length - 1];
    var sLastStringFromHyphen = sLastStringFromPathname.split('-')[
      sLastStringFromPathname.split('-').length - 1]
    
    var fileReg = /File\:/ig;
    if (oUrl.searchImage || reg.exec(oHistoryItem.url()) && !oUrl.pathname.match(fileReg)) {
      // Image
      var sImageUrl = oUrl.searchImage || oHistoryItem.url();
      return new Cotton.UI.Stand.Story.Card.Image(sImageUrl, oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "www.youtube.com" && oUrl.dSearch['v']) {
      // Video - Youtube
      return new Cotton.UI.Stand.Story.Card.Video(oUrl.dSearch['v'], "youtube",
        oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "vimeo.com"
        && oUrl.pathname.match(/(\/[0-9]+)$/)) {
      // Video - Vimeo
      return new Cotton.UI.Stand.Story.Card.Video(sLastStringFromPathname, "vimeo",
        oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "www.dailymotion.com"
        && oUrl.pathname.split('/')[1] == "video") {
      // Video - Dailymotion
      return new Cotton.UI.Stand.Story.Card.Video(oUrl.pathname.split('/')[2],
        "dailymotion", oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "www.dailymotion.com" && oUrl.dHash['video']) {
      return new Cotton.UI.Stand.Story.Card.Video(oUrl.dHash['video'],
        "dailymotion", oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname.match(/^(maps\.google\.)/)
        && oUrl.pathname == "/maps") {
      var sMapCode = oUrl.dSearch['q'];
      return new Cotton.UI.Stand.Story.Card.Map(sMapCode, oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "www.google.com" && oUrl.pathname == "/maps") {
      var sMapCode = oUrl.dSearch['q'];
      return new Cotton.UI.Stand.Story.Card.Map(sMapCode, oHistoryItem, oGlobalDispatcher);
    } else if (oUrl.hostname === "www.google.com" && oUrl.pathname == "/maps/preview") {
      oUrl.fineDecomposition();
      if (oUrl.dSearch['q']){
        var sMapCode = oUrl.dSearch['q'];
        return new Cotton.UI.Stand.Story.Card.Map( sMapCode, oHistoryItem, oGlobalDispatcher);
      } else if (oUrl.dHash['!q']){
        var sMapCode = oUrl.dHash['!q'];
        return new Cotton.UI.Stand.Story.Card.Map(sMapCode, oHistoryItem, oGlobalDispatcher);
      } else {
        // Default
        return new Cotton.UI.Stand.Story.Card.Default(oHistoryItem, oGlobalDispatcher);
      }
    } else {
      // Default
      return new Cotton.UI.Stand.Story.Card.Default(oHistoryItem, oGlobalDispatcher);
    }
    //TODO(rkorach) : include slideshare
  }

});
