'use strict';

/**
 *
 * @returns {Cotton.Behavior.Passive.Parser}
 */
Cotton.Behavior.Passive.ParserFactory = function(oClient, oMessenger) {

  var oUrl = new UrlParser(window.location.href);
  oUrl.fineDecomposition();

  if (oUrl.isWikipedia) {
    // Wikipedia
    return new Cotton.Behavior.Passive.WikipediaParser(oClient, oMessenger);
  } else if (oUrl.isGoogle && oUrl.dSearch && oUrl.dSearch['tbm'] === 'isch'){
    // Google image search
    return new Cotton.Behavior.Passive.GoogleImageParser(oClient, oMessenger, oUrl);
  } else if (oUrl.isGoogle && oUrl.keywords){
    // Google
    return new Cotton.Behavior.Passive.GoogleParser(oClient, oMessenger, oUrl);
  } else {
    // Default
    return new Cotton.Behavior.Passive.Parser(oClient, oMessenger);
  }
};