'use strict';

/**
 *   Upper block of the menu, contains sticker and actions
 **/

Cotton.UI.SideMenu.SumUp = Class.extend({

  _oMenu : null,

  _$sumUp : null,
  _oSticker : null,
  _oActions : null,

  init: function(oMenu){
	  this._oMenu = oMenu;

    this._$sumUp = $('<div class="ct-sum_up"></div>');
    this._oSticker = new Cotton.UI.SideMenu.Sticker(this);
    this._oActions = new Cotton.UI.SideMenu.Actions(this);

    //construct element
    this._$sumUp.append(
	    this._oSticker.$()
	  )
  },

  $ : function(){
	  return this._$sumUp;
  },

  menu : function(){
    return this._oMenu;
  },

  sticker : function(){
    return this._oSticker;
  }

});