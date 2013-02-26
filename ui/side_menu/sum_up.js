'use strict';

Cotton.UI.SideMenu.SumUp = Class.extend({

  _oMenu : null,

  _$sumUp : null,
  _oSticker : null,

  init: function(oMenu){
    this._$sumUp = $('.sum_up');
    this._oSticker = new Cotton.UI.Menu.Sticker(this._oMenu);
  },


});