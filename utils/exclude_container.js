'use strict';

/**
 * ExcludeContainer
 *
 * This class provides some methods to exclude, some urls. Like adds,
 * porn content, or some redondent url.
 */
Cotton.Utils.ExcludeContainer = Class.extend({

  _lExludePatterns : null,
  _lToolsHostname : null,

  /**
   * {Cotton.Utils.CornExcluder}
   */
  _oCornExcluder : null,

  /**
   *
   */
  init : function() {
    var self = this;
    self._lExludePatterns = Cotton.Config.Parameters.lExcludePatterns;
    self._lToolsHostname = Cotton.Config.Parameters.lTools;
    self._oCornExcluder = new Cotton.Utils.CornExcluder();
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
    return (sProtocol === "file:") && (! DEBUG);
  },

  isChromeExtension : function(sProtocol) {
    return sProtocol === "chrome-extension:";
  },

  isError : function(oUrl) {
    return (oUrl.error.code !== 0);
  },

  isLocalhost : function(sHostname) {
    return sHostname === "localhost";
  },

  /**
   * Return if the url is an exluded pattern.
   *
   * @param sUrl
   * @return {boolean}
   */
  isExcludedPattern : function(sUrl){
    var self = this;
    var iLength = self._lExludePatterns.length;
    for ( var i = 0; i < iLength; i++) {
      var sPattern = self._lExludePatterns[i];
      var oRegExp = new RegExp(sPattern, "g");
      if (oRegExp.test(sUrl)) {
        return true;
      }
    }
    return false;
  },

  isWhitelisted : function(oUrl){
    // some https sites are allowed
    return oUrl.isGoogle || oUrl.isGoogleMaps || oUrl.isWikipedia || oUrl.isYoutube || oUrl.isVimeo;
  },

  isHttpsRejected : function(oUrl){
    // see if an https site is really rejected
    return oUrl.isHttps && !this.isWhitelisted(oUrl);
  },

  /**
   * @param {String} sTitle:
   *        title of the page only avaiable when document is ready.
   */
  isTitleCorn : function(sTitle) {
    return this._oCornExcluder.isTitleCorn(sTitle);
  },

  /**
   * Return if the url should be excluded.
   *
   * @param sUrl
   * @return {boolean}
   */
  isExcluded : function(sUrl){
    var oUrl = new UrlParser(sUrl);

    return this.isHttpsRejected(oUrl) || this.isExcludedPattern(sUrl)
      || this.isTool(oUrl.hostname)
      || this.isFileProtocol(oUrl.protocol)
      || this.isChromeExtension(oUrl.protocol)
      || this.isLocalhost(oUrl.hostname)
      || this.isError(oUrl)
      || this._oCornExcluder.isCorn(sUrl, oUrl.hostname_without_country);
  },

});
