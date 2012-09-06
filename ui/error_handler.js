'use strict';

Cotton.UI.ErrorHandler = Class.extend({
  _oCurtain : null,

  _$window : null,
  _$p : null,
  _lErrors : [],

  init : function(oCurtain, $global){
    var self = this;

    this._oCurtain = oCurtain;
    this._$window = $global;

    this._$window.onerror = function(msg, url, line) {
         self._lErrors.push(arguments);
         self._oCurtain.displayError(msg, url, line);
    }
  },
});
