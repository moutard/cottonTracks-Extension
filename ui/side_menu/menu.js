'use strict';

Cotton.UI.SideMenu.Menu = Class.extend({

	_$menu : null,
	_oStory : null,
	_oSticker : null,

	init : function(oStory){
		this._$menu = $(".ct-menu");

		this._oStory = oStory;
		this._oSticker = new Cotton.UI.SideMenu.Sticker(this)
	},

  $ : function(){
	  return this._$menu;
  },

  story : function(){
	  return this._oStory;
  }
});
