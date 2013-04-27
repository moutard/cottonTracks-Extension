'use strict';

/**
 * Sticker in SumUp, contains story thumbnail, and story info block (with title,
 * and content detail == number of elements)
 **/

Cotton.UI.SideMenu.Preview.Sticker.Element = Class.extend({
  /**
   * {DOM} current element.
   */
  _$sticker : null,

  /**
   * {Cotton.UI.SideMenu.Preview.Sticker.Image}
   */
  _oStickerImage : null,

  /**
   * {Cotton.UI.SideMenu.Preview.Sticker.Infos}
   */
  _oStickerInfos : null,

  init: function(sTile, sImage, oDispatcher) {
	  this._$sticker = $('<div class="ct-sticker"></div>');
	  this._oStickerImage = new Cotton.UI.SideMenu.Preview.Sticker.Image(sImage, this);
	  this._oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(sTile, oDispatcher,
	    this);

    // Construct element.
	  this._$sticker.append(
	    this._oStickerImage.$(),
	    this._oStickerInfos.$()
	  );

  },

  $ : function() {
	  return this._$sticker;
  },

  recycle : function(oStory) {
    this._oStickerImage.recycle(oStory.featuredImage());
  },

  stickerImage : function() {
    return this._oStickerImage;
  },

  stickerInfos : function() {
    return this._oStickerInfos;
  }

});
