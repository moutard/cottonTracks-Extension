'use strict';

/**
 *   Sticker in SumUp, contains story thumbnail,
 *   and story info block (with title, and content detail == number of elements)
 **/

Cotton.UI.SideMenu.Sticker = Class.extend({

  _oSumUp : null,
  _$sticker : null,
  _oStickerImage : null,
  _oStickerInfos : null,

  init: function(oSumUp){
	  this._oSumUp = oSumUp;

	  this._$sticker = $('<div class="ct-sticker"></div>');
	  this._oStickerImage = new Cotton.UI.SideMenu.StickerImage(this);
	  this._oStickerInfos = new Cotton.UI.SideMenu.StickerInfos(this);

    //construct element
	  this._$sticker.append(
	    this._oStickerImage.$(),
	    this._oStickerInfos.$()
	  );

  },

  $ : function(){
	  return this._$sticker;
  },

  sumUp : function(){
    return this._oSumUp;
  },

  stickerImage : function(){
    return this._oStickerImage;
  }

});
