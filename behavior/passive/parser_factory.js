'use strict';

/**
 *
 * @returns {Cotton.Behavior.Passive.Parser}
 */
Cotton.Behavior.Passive.ParserFactory = function(oClient) {

  var oUrl = new UrlParser(window.location.href);
  oUrl.fineDecomposition();

  // Detect if it's wikipedia.
  var reg = new RegExp("wikipedia", "g");

  if (reg.exec(oUrl.hostname)) {
    // Wikipedia
    return new Cotton.Behavior.Passive.WikipediaParser(oClient);
  } else if (oUrl.isGoogle && oUrl.searchImage){
    // Google image search
    return new Cotton.Behavior.Passive.GoogleImageParser(oClient, oUrl);
  } else if (oUrl.isGoogle && oUrl.keywords){
    // Google
    return new Cotton.Behavior.Passive.GoogleParser(oClient, oUrl);
  } else {
    // Default
    return new Cotton.Behavior.Passive.Parser(oClient);
  }
};