'use strict';

/**
 *   Infos on the story: title and content details
 **/

Cotton.UI.SideMenu.Preview.Sticker.Infos = Class.extend({

  /**
   * {Cotton.Messaging.Dispatcher} dispatcher for UI
   */
  _oDispatcher : null,

  _$stickerInfos : null,
  _$stickerTitle : null,
  _$stickerDetails : null,

  init: function(sStoryTitle, iStoryId, oDispatcher, iNumberOfItems){
    var self = this;
	  this._oDispatcher = oDispatcher;
	  this._iNumberOfItems = iNumberOfItems;

    // Current element.
	  this._$stickerInfos = $('<div class="ct-sticker_infos"></div>');

    // Sub elements.
	  this._$stickerTitle = $('<div class="ct-sticker_title"></div>').text(sStoryTitle).click(function(){
	    Cotton.ANALYTICS.editStoryTitle('story_title');
    });

    this._$stickerTitle.attr('contenteditable','true').blur(function(){
      self._oDispatcher.publish("edit_title", {"title": $(this).text(), "id": iStoryId});
    }).keypress(function(e){
      if (e.which === 13){
        $(this).blur();
        e.preventDefault();
      }
    });
    self._oDispatcher.subscribe("edit_title", this, function(dArguments){
      if (dArguments['id'] === iStoryId){
        self.changeTitle(dArguments['title']);
      }
    });
	  this._$stickerDetails = $('<div class="ct-sticker_details"></div>');

    // Count details
    this._$total_count = $('<span class="total_count">' + this._iNumberOfItems + ' cards</span>');

    // increase count of cards when a new item is set from pool
    this._oDispatcher.subscribe('add_historyItem_from_pool', this, function(dArguments){
      this._iNumberOfItems += 1;
      this._$total_count.text(this._iNumberOfItems + ' cards');
    });

    // decrease count of cards when an item is deleted
    this._oDispatcher.subscribe('item:delete', this, function(dArguments){
      this._iNumberOfItems -= 1;
      this._$total_count.text(this._iNumberOfItems + ' cards');
    });

    //construct element
    this._$stickerInfos.append(
  	  this._$stickerTitle,
      this._$stickerDetails.append(
        this._$total_count
      )
  	);
  },

  $ : function() {
	  return this._$stickerInfos;
  },

  title : function() {
    return this._$stickerTitle;
  },

  editTitle : function() {
    this._$stickerTitle.focus();
  },

  changeTitle : function(sTitle) {
    this._$stickerTitle.text(sTitle);
  }

});
