'use strict';

/**
 * @param {string} : sWord
 *
 * This function hash the word so it's not human readable, or the code  parsed
 * by bots.
 * This function is reversible. For the moment reversible is not usefull here
 * but the real things important is that the hash preserve the grep or regex
 * method. That's why we don't use md5 method.
 *
 * This is a very simple method. As we don't need reversible we may use
 * a permutation method. More complex to reverse.
 */
Cotton.Utils.CornHash = function(sWord) {
  var iStart = 32;
  var iEnd = 126;
  var sHashWord = "";
  var iLength = sWord.length;
  for (var i = 0; i < iLength; i++) {
    sHashWord = sHashWord + String.fromCharCode(sWord.charCodeAt(i) + 1);
  }
  return sHashWord;
};


/**
 * unhash the previous method. For the moment just used for test.
 */
Cotton.Utils.CornUnHash = function(sWord) {
  var iStart = 32;
  var iEnd = 126;
  var sHashWord = "";
  var iLength = sWord.length;
  for (var i = 0; i < iLength; i++) {
    sHashWord = sHashWord + String.fromCharCode(sWord.charCodeAt(i) - 1);
  }
  return sHashWord;
};

/**
 * ExcludeContainer
 *
 * This class provides some methods to exclude, some urls. Like adds,
 * porn content, or some redondent url.
 */
Cotton.Utils.CornExcluder = Class.extend({

  _lExcludePatterns : null,
  _lCornHostname : null,
  /**
   *
   */
  init : function() {
    var self = this;
    // As we use regex for ExcludePatterns use the hash function.
    this._lExcludePatterns = ["qpso", "tfy", "cmpxkpc"];

    // For tools we can use a real md5 method.
    this._lCornHostname = [];
  },

  isExcludedPattern : function(sHashUrl) {
    var self = this;
    var iLength = self._lExcludePatterns.length;
    for ( var i = 0; i < iLength; i++) {
      var sPattern = self._lExcludePatterns[i];
      var oRegExp = new RegExp(sPattern, "g");
      if (oRegExp.test(sHashUrl)) {
        return true;
      }
    }
    return false;
  },

  isExcludedHostname : function(sHashUrl) {
    return this._lCornHostname.indexOf(sHashUrl) !== -1;
  },

  isCorn : function(sUrl) {
    var oUrl = new UrlParser(sUrl);
    var sHashUrl = Cotton.Utils.CornHash(sUrl);
    var sHashHostname = Cotton.Utils.CornHash(oUrl.hostname);
    return this.isExcludedHostname(sHashHostname) || this.isExcludedPattern(sHashUrl);
  }

});


