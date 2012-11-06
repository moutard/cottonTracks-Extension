'use strict';

/**
 * 
 * @returns {Cotton.Behavior.Passive.Parser}
 */
Cotton.Behavior.Passive.ParserFactory = function() {

  var oUrl = new parseUrl(window.location.href);
  oUrl.fineDecomposition();

  // Detect if it's wikipedia.
  var reg = new RegExp("wikipedia", "g");

  if (reg.exec(oUrl.hostname)) {
    // Wikipedia
    return new Cotton.Behavior.Passive.WikipediaParser();
  } else if (0) {
    // Image, from google search image result.
    return new Cotton.Behavior.Passive.GoogleParser();
  } else {
    // Default
    return new Cotton.Behavior.Passive.Parser();
  }
};
