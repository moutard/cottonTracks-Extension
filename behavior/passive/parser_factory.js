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
  } else if (0) {
    // Image, from google search image result.
    return new Cotton.Behavior.Passive.GoogleParser(oClient);
  } else {
    // Default
    return new Cotton.Behavior.Passive.Parser(oClient);
  }
};
