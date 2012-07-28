'use strict';

/**
 * ExcludeContainer
 * 
 * This class provides some methods to exclude, some urls. Maybe porn content
 */
Cotton.Utils.ExcludeContainer = Class.extend({

  _lExludePatterns : null,
  _lExludeUrls : null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;
    self._lExludePatterns = Cotton.Config.Parameters.lExcludePatterns;
    self._lExludeUrls = Cotton.Config.Parameters.lExcludeUrls;

  },

  /**
   * Return if the url should be excluded.
   * 
   * @param sUrl
   * @return {boolean}
   */
  isExcluded : function(sUrl) {
    var self = this;
    var oUrl = new parseUrl(sUrl);
    var sProtocol = oUrl.protocol;

    // exlude Https except if it's google.
    if (sProtocol === "https:") {
      if (!oUrl.isGoogle) {
        return true;
      }
    }

    // exclude if corresponding to a exclude pattern.
    for ( var i = 0, sPattern; sPattern = self._lExludePatterns[i]; i++) {
      var oRegExp = new RegExp(sPattern, "g");
      if (oRegExp.test(sUrl)) {
        return true;
      }
    }

    // exclude if it's forbidden url.
    return _.indexOf(self._lExludeUrls, sUrl) !== -1;
  },

});
