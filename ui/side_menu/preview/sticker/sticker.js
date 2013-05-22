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

  init: function(oStory, oDispatcher, sTypeOfSticker) {
    var self = this;

    this._oDispatcher = oDispatcher;
    this._oStory = oStory;

	  this._$sticker = $('<div class="ct-sticker"></div>');
	  this._oStickerImage = new Cotton.UI.SideMenu.Preview.Sticker.Image(oStory.featuredImage());
	  this._oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(oStory.title(), oDispatcher,
	    sTypeOfSticker, oStory.historyItemsId().length);

    if (sTypeOfSticker === "relatedStory"){
  	  this._$sticker.click(function(){
  	    Cotton.ANALYTICS.changeStory();
        self.enterStory(self._oStory.id());
      });
    }

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
  },

  enterStory : function(iStoryId){
    this._oDispatcher.publish('enter_story', {'story_id': iStoryId});
  },


});
