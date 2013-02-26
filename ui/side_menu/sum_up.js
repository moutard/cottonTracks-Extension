'use strict';

Cotton.UI.SideMenu.SumUp = Class.extend({

  _oMenu : null,

  _$sumUp : null,
  _oSticker : null,
  _oActions : null,

  init: function(oMenu){
	  this._oMenu = oMenu;
	
    this._$sumUp = $('<div class="ct-sum_up"></div>');
    this._oSticker = new Cotton.UI.SideMenu.Sticker(this._oMenu);
    this._oActions = new Cotton.UI.SideMenu.Actions(this._oMenu);

    //construct element
    this._$sumUp.append(
	    this._oSticker.$(),
	    this._oActions.$()
	  )
  },

  $ : function(){
	  return this._$sumUp;
  }

});