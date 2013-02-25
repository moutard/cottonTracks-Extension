'use strict';

/**
 * Item Summary Info Contains title and source for maps / videos
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
      if (self._oItemContent.item().$().hasClass("ct-item-video")){
        this._$itemTitle.text("video");
      }
    }

  },

  $ : function() {
    return this._$itemTitle;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemTitle);
  },

});
