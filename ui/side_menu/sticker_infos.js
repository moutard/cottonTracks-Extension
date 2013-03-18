'use strict';

/**
 *   Infos on the story: title and content details
 **/

Cotton.UI.SideMenu.StickerInfos = Class.extend({

  _oSticker : null,
  _$stickerInfos : null,
  _$stickerTitle : null,
  _$stickerDetails : null,

  init: function(oSticker){

	  this._oSticker = oSticker;
	  this._$stickerInfos = $('<div class="ct-sticker_infos"></div>');
	  this._$stickerTitle = $('<div class="ct-sticker_title"></div>');
	  this._$stickerDetails = $('<div class="ct-sticker_details"></div>');

    //set values

    //Title
    var sStickerTitle = this._oSticker.sumUp().menu().story().title();
    this._$stickerTitle.text(sStickerTitle);

    //Count details
    var sBull = '<span class="bull">&bull; </span>';
    var sArticlesCount = '<span class="articles_count"></span> article(s) ';
    var sImagesCount = '<span class="images_count"></span> photo(s) ';
    var sVideosCount = '<span class="videos_count"></span> video(s)';

		this._$stickerDetails.html(sArticlesCount + sBull + sImagesCount + sBull + sVideosCount);

    //construct element
	  this._$stickerInfos.append(
	    this._$stickerTitle,
	    this._$stickerDetails
	  );

  },

  $ : function() {
	  return this._$stickerInfos;
  }

});