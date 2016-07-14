"use strict";

Cotton.UI.Stand.Home.Library.UILibrary = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$library = $('<div class="ct-library"></div>');
    this._$library_container = $('<div class="ct-library_container"></div>');
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lStickers = [];

    this._$library.append(
      this._$library_container
    )
  },

  $ : function() {
    return this._$library;
  },

  drawCheesecakes : function(lCheesecakes) {
    var iLength = lCheesecakes.length;
    for (var i = 0; i < iLength; i++) {
      var oSticker = new Cotton.UI.Stand.Common.Sticker(lCheesecakes[i], 'library', this._oGlobalDispatcher);
      this._lStickers.push(oSticker);
      this._$library_container.append(oSticker.$());
    }
  },

  removeCheesecake : function(iId) {
    var lNewStickers = [];
    var iLength = this._lStickers.length;
    for (var i = 0; i < iLength; i++) {
      if (this._lStickers[i].id() === iId) {
         this._lStickers[i].purge();
      } else {
        lNewStickers.push(this._lStickers[i]);
      }
      this._lStickers[i] = null;
    }
    this._lStickers = lNewStickers;
  },

  _purgeStickers : function() {
    var iLength = this._lStickers.length;
    for (var i = 0; i < iLength; i++) {
      this._lStickers[i].purge();
      this._lStickers[i] = null;
    }
    this._lStickers = null;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
    this._oGlobalDispatcher = null;
    this._purgeStickers();
    this._$library.remove();
    this._$library = null;
  }
});
