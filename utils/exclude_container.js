'use strict';

/**
 * ExcludeContainer
 * 
 * This class provides some methods to exclude, some urls. Maybe porn content
 */
Cotton.Utils.ExcludeContainer = Class.extend({

  _lExludesPattern : null,
  _lExludesUrl : null,

  /**
   * @constructor
   */
  init : function() {

    self._lExludesPattern = Cotton.Config.Parameters.lExcludePatterns;
    self._lExludesUrl = Cotton.Config.Parameters.lExcludeUrl;

  },

  /**
   * Return if the url should be excluded.
   * 
   * @param sUrl
   * @return {boolean}
   */
  isExcluded : function(sUrl) {
    var oUrl = new parseUrl(sUrl);
    var sProtocol = oUrl.protocol;

    // exlude Https except if it's google.
    if (sProtocol === "https:") {
      if (!oUrl.isGoogle) {
        return true;
      }
    }

    // exclude if corresponding to a exclude pattern.
    for ( var i = 0, sPattern; sPattern = self._lExludesPattern[i]; i++) {
      var oRegExp = new RegExp(sPattern, "g");
      if (oRegExp.test(sUrl)) {
        return true;
      }
    }

    // exclude if it's forbidden url.
    return _.indexOf(_lExludesUrl, sUrl) !== -1;
  },

});
