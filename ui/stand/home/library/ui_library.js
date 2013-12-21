"use strict";

Cotton.UI.Stand.Home.Library.UILibrary = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$library = $('<div class="ct-cheesecake_library"></div>');
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lStickers = [];

    this._oGlobalDispatcher.publish('ask_more_cheesecakes');

    this._oGlobalDispatcher.subscribe('give_more_cheesecakes', this, function(dArguments){
      this.drawCheesecakes(dArguments['cheesecakes']);
    });
  },

  $ : function() {
    return this._$library;
  },

  drawCheesecakes : function(lCheesecakes) {
    var iLength = lCheesecakes.length;
    for (var i = 0; i < iLength; i++) {
      var oSticker = new Cotton.UI.Stand.Common.Sticker(lCheesecakes[i], 'library', this._oGlobalDispatcher);
      this._lStickers.push(oSticker);
      this._$library.append(oSticker.$());
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
    this._oGlobalDispatcher.unsubscribe('give_more_cheesecakes', this);
    this._oGlobalDispatcher = null;
    this._purgeStickers();
    this._$library.remove();
    this._$library = null;
  }
});