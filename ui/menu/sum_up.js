'use strict';

Cotton.UI.Menu.MenuSumUp = Class.extend({

  _$sumUp : null,
  _oSticker : null,

  init: function(){
    this._$sumUp = $('.sum_up');
    this._oSticker = new Cotton.UI.Menu.Sticker();
  },


});