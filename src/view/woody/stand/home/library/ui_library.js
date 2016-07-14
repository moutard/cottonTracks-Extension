"use strict";

Cotton.UI.Stand.Home.Library.UILibrary = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$library = $('<div class="ct-library"></div>');
    this._$library_container = $('<div class="ct-library_container"></div>');
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lStickers = [];

    this._oGlobalDispatcher.subscribe('window_resize', this, function(dArguments){
      this.setWidth(this._computeSlots(dArguments['width']));
    });

    this._$library.append(
      this._$library_container
    )
  },

  $ : function() {
    return this._$library;
  },

  drawCheesecakes : function(lCheesecakes) {
    this.setWidth(this._computeSlots($(window).width()));

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

  _computeSlots : function(iWindowWidth) {
    var STICKER_WIDTH = 240;
    var STICKER_MARGIN = 20;
    var iSlotsPerLine = Math.floor((iWindowWidth)/(STICKER_WIDTH + 2 * STICKER_MARGIN));
    return iSlotsPerLine;
  },

  setWidth : function(iSlotsPerLine) {
    var STICKER_WIDTH = 240;
    var STICKER_MARGIN = 20;
    this._$library_container.width(iSlotsPerLine * (STICKER_WIDTH + 2 * STICKER_MARGIN));
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