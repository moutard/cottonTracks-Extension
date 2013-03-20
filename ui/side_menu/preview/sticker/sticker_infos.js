'use strict';

/**
 *   Infos on the story: title and content details
 **/

Cotton.UI.SideMenu.Preview.Sticker.Infos = Class.extend({

  /**
   * {Cotton.UI.SideMenu.Preview.Sticker} parent element.
   */
  _oSticker : null,

  _$stickerInfos : null,
  _$stickerTitle : null,
  _$stickerDetails : null,

  init: function(sStoryTitle, oSticker){

	  this._oSticker = oSticker;

    // Current element.
	  this._$stickerInfos = $('<div class="ct-sticker_infos"></div>');

    // Sub elements.
	  this._$stickerTitle = $('<div class="ct-sticker_title"></div>').text(
      sStoryTitle);
	  this._$stickerDetails = $('<div class="ct-sticker_details"></div>');

    //Count details
    // FIXME(rmoutard): put text in a div to.
    // FIXME(rmoutard) do not use space, use css.
    var $bull = $('<span class="bull">&bull;</span>');
    var $articles_count = $('<span class="articles_count"></span> article(s) ');
    var $images_count = $('<span class="images_count"></span> photo(s) ');
    var $videos_count = $('<span class="videos_count"></span> video(s)');

    //construct element
	  this._$stickerInfos.append(
	    this._$stickerTitle,
      this._$stickerDetails.append(
          $bull,
          $articles_count,
          $images_count,
          $videos_count
        )
	  );

  },

  $ : function() {
	  return this._$stickerInfos;
  }

});
