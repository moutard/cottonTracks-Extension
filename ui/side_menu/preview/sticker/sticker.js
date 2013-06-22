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
	  this._oStickerToolbox = new Cotton.UI.SideMenu.Preview.Sticker.Toolbox(oStory.id(), this, this._oDispatcher);
	  this._oStickerInfos = new Cotton.UI.SideMenu.Preview.Sticker.Infos(oStory.title(),
  	  oStory.id(), oDispatcher,sTypeOfSticker, oStory.historyItemsId().length);

    if (sTypeOfSticker === "relatedStory"){
  	  this._$sticker.click(function(e){
  	    if (e.target !== self._oStickerToolbox.$()[0]
  	      && e.target !== self._oStickerToolbox.deleteButton()[0]
  	      && e.target !== self._oStickerToolbox.renameButton()[0]
  	      && e.target !== self._oStickerInfos.title()[0]){
  	        Cotton.ANALYTICS.changeStory();
            self.enterStory(self._oStory.id());
  	    }
      });
    }

    this._oDispatcher.subscribe('story:deleted', this, function(dArguments){
      if (dArguments['id'] === this._oStory.id()){
        if (sTypeOfSticker === 'relatedStory'){
          this.hide();
        } else {
          self._oDispatcher.publish('open_manager');
        }
      }
    });

    if (sTypeOfSticker !== 'relatedStory'){
      this._oDispatcher.subscribe('enter_story', this, function(dArguments){
        this._oDispatcher.unsubscribe('story:deleted', this);
      });
    }

    // Construct element.
	  this._$sticker.append(
	    this._oStickerImage.$(),
	    this._oStickerToolbox.$(),
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

  editTitle : function(){
    this._oStickerInfos.editTitle();
  },

  hide : function(){
    this.$().hide(400, function(){
      self.$().addClass('hidden')
    });
  }


});
