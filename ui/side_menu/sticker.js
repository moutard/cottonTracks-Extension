'use strict';

/**
 *   Sticker in SumUp, contains story thumbnail,
 *   and story info block (with title, and content detail == number of elements)
 **/

Cotton.UI.SideMenu.Sticker = Class.extend({

  _oMenu : null,
  _$sticker : null,
  _oStickerImage : null,
  _oStickerInfos : null,

  init: function(oMenu){
	  this._oMenu = oMenu;

	  this._$sticker = $('<div class="ct-sticker"></div>');
	  this._oStickerImage = new Cotton.UI.SideMenu.StickerImage(this._oMenu);
	  this._oStickerInfos = new Cotton.UI.SideMenu.StickerInfos(this._oMenu);

    //construct element
	  this._$sticker.append(
	    this._oStickerImage.$(),
	    this._oStickerInfos.$()
	  );

  },

  $ : function(){
	  return this._$sticker;
  },

});
