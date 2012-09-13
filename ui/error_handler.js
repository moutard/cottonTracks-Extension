'use strict';

Cotton.UI.ErrorHandler = Class.extend({
  _oCurtain : null,

  _$window : null,
  _$p : null,
  _lErrors : [],

  init : function($global, oCurtain) {
    var self = this;

    this._oCurtain = oCurtain;
    this._$window = $global;

    this._$window.onerror = function(msg, url, line) {
      var error = {
        'msg' : msg,
        'url' : url,
        'line' : line
      };
      self._lErrors.push(error);
      if (self._oCurtain) {
        self._oCurtain.displayError(msg, url, line);
      }

    }
  },

  curtain : function() {
    return this._oCurtain;
  },

  setCurtain : function(oCurtain) {
    var self = this;
    self._oCurtain = oCurtain;
    for ( var i = 0; i < self._lErrors.length; i++) {
      var error = self._lErrors[i];
      self._oCurtain.displayError(error['msg'], error['url'], error['line']);
    }
  }
});
