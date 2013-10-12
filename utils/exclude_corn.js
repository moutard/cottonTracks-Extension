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
    this._lExcludePatterns = ["qpso", "tfy", "cmpxkpc", "yyy", "cbohcspt", "xipsft", "qvttz"];
    this._lCornHostname = ["zpvqpso", "qpsoivc", "sfeuvcf", "qfsgfduhjsmt", "yoyy", "ywjefpt", "zpvkj{{", "dprov", "qjolejop", "cppmpp", "fuvcfs", "uvcfqpnnpt", "bevmugsjfoegjoefs", "yibntufs", "dmjqivoufs", "yuvcf", "bmpuqpso", "qpsobujwf", "uvcf9", "ipoebwjt", "tivgvoj", "zvwvuv", "tqbolxjsf", "uobgmjy", "fgvlu", "wpzfvsxfc", "xjef7", "xbudifstxfc", "nbyqpso", "wvmwbuvcf", "npwjfhbups", "npgptfy", "zb{vn", "fnqgmjy", "nfhbqpsop", "qspo", "qpsodps", "mvcfuvcf", "wje3d", "tfycpu", "dmfbsdmjqt", "upubmqpso", "ujbwbtuvcf", "qpsobujwf", "bwifsf", "uifqpsodpsf", "npwjftboe", "lff{npwjft", "gsff3qffl", "5dbn", "nzgsffdbnt", "dbn5", "difhhju", "qvsfuob", "uffotopx", "esuvcfs", "tujdljoh", "dpmmfhfxipsft", "xbolfsivu", "hjsmtjouvcf", "uvcfhvjef", "tljnuvcf", "cbohcvmm", "gsfvecpy", "tvcmjnfnpwjft", "tobudiodsbdl", "lpptuvcf", "bqfuvcf", "cvutopx", "y4yuvcf", "tdbgz", "hpo{pnpwjf", "nbtujtibsf"];
  },

  /**
   * Check if hash pattern are found in the hash url.
   * @param {String} sHashUrl:  url hashed
   */
  isExcludedPattern : function(sHashUrl) {
    var self = this;
    var iLength = self._lExcludePatterns.length;
    for ( var i = 0; i < iLength; i++) {
      var sPattern = self._lExcludePatterns[i];
      var oRegExp = new RegExp(sPattern, "gi"); // global and case insensitive
      // need case insensitive for the url.
      if (oRegExp.test(sHashUrl)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Find if the hash url is in the black list.
   */
  isExcludedHostname : function(sHashUrl) {
    return this._lCornHostname.indexOf(sHashUrl) !== -1;
  },

  /**
   * We need a specific method to analyse title after
   * @param {String} sTitle:
   *        not hash title.
   */
  isTitleCorn : function(sTitle) {
    var sHashTitle = Cotton.Utils.CornHash(sTitle);
    return this.isExcludedPattern(sHashTitle);
  },

  /**
   * @param {String} sUrl
   * @param {String} sHostname:
   *        hostname is generated by url parser but only once by the exclude
   *        container.
   */
  isCorn : function(sUrl, sHostname) {
    var sHashUrl = Cotton.Utils.CornHash(sUrl);
    var sHashHostname = Cotton.Utils.CornHash(sHostname);
    return this.isExcludedPattern(sHashUrl) || this.isExcludedHostname(sHashHostname) ;
  }

});


