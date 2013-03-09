'use strict';

/**
 * Item_title Contains title
 */
Cotton.UI.Story.Item.Title = Class.extend({

  _oItemContent : null,

  _$itemTitle : null,


  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    // current item
    this._$itemTitle = $('<h3></h3>');

    // Title
    if (this._oItemContent.item().visitItem().title() !== "") {
      this._$itemTitle.text(this._oItemContent.item().visitItem().title());
    } else {
	    // set 'video' as a title if no title has been found for video items
      if (self._oItemContent.item().$().hasClass("ct-item-video")){
        this._$itemTitle.text("video");
      }
    }

  },

  $ : function() {
    return this._$itemTitle;
  },

});
