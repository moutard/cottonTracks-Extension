'use strict';

/**
 *   Global menu of the interface.
 *   Contains the SumUp of the story (with sticker image, title,
 *   content details, and actions available)
 *   the filters, and the settings button
 **/

Cotton.UI.SideMenu.Menu = Class.extend({

	_$menu : null,
	_oStory : null,
	_oSumUp : null,
	_oFilters : null,
	_oSettings : null,
	_$separationLineTop : null,
	_$separationLineBottom : null,

	init : function(oStory){
		this._$menu = $(".ct-menu");

		this._oStory = oStory;
		this._oSumUp = new Cotton.UI.SideMenu.SumUp(this);
		this._oFilters = new Cotton.UI.SideMenu.Filters(this);
		this._oSettings = new Cotton.UI.SideMenu.Settings(this);
		this._$separationLineTop = $('<div class="separation_line"></div>');
		this._$separationLineBottom = $('<div class="separation_line"></div>');

		//construct element
		this._$menu.append(
		  this._oSumUp.$(),
		  this._oFilters.$().prepend(this._$separationLineTop),
		  this._oSettings.$()
	  )
	},

  $ : function(){
	  return this._$menu;
  },

  story : function(){
	  return this._oStory;
  }
});
