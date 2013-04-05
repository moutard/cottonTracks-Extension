'use strict';

/**
 * ExcludeContainer
 *
 * This class provides some methods to exclude, some urls. Like adds,
 * porn content, or some redondent url.
 */
Cotton.Utils.ExcludeContainer = Class.extend({

  _lExludePatterns : null,
  _lExludeUrls : null,
  _lToolsHostname : null,
  /**
   * 
   */
  init : function() {
    var self = this;
    self._lExludePatterns = Cotton.Config.Parameters.lExcludePatterns;
    self._lExludeUrls = Cotton.Config.Parameters.lExcludeUrls;
    self._lToolsHostname = Cotton.Config.Parameters.lTools;
  },

  /**
   * Return if the url is a tool.
   *
   * @param sHostname
   * @return {boolean}
   */
  isTool : function(sHostname){
    var self = this;
    return _.indexOf(self._lToolsHostname, sHostname) !== -1;
  },

  isFileProtocol : function(sProtocol) {
    return sProtocol === "file:";
  },

  isLocalhost : function(sHostname) {
    return sHostname === "localhost";
  },

  /**
   * Return if the url is part of the excluded url.
   *
   * @param sHostname
   * @return {boolean}
   */
  isExcludedUrl : function(sUrl){
    var self = this;
    return _.indexOf(self._lExludeUrls, sUrl) !== -1;
  },

  /**
   * Return if the url is an exluded pattern.
   *
   * @param sUrl
   * @return {boolean}
   */
  isExcludedPattern : function(sUrl){
    var self = this;
    for ( var i = 0, sPattern; sPattern = self._lExludePatterns[i]; i++) {
      var oRegExp = new RegExp(sPattern, "g");
      if (oRegExp.test(sUrl)) {
        return true;
      }
    }
    return false;
  },

  isHttps : function(oUrl){
    // exlude Https except if it's google.
    return oUrl.protocol === "https:" && !oUrl.isGoogle
      && !oUrl.isGoogleMap && !oUrl.isVimeo;
  },

  /**
   * Return if the url should be excluded.
   *
   * @param sUrl
   * @return {boolean}
   */
  isExcluded : function(sUrl){
    var self = this;
    var oUrl = new UrlParser(sUrl);

    return self.isHttps(oUrl) || self.isExcludedPattern(sUrl)
      || self.isExcludedUrl(sUrl) || self.isTool(oUrl.hostname)
      || self.isFileProtocol(oUrl.protocol)
      || self.isLocalhost(oUrl.hostname);
  },

});
