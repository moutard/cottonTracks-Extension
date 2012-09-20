'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Image = Cotton.UI.Story.Item.Content.Element.extend({

  _$featured_image : null,
  _$img : null,

  init : function(oItem, sType) {
    this._super(oItem);

    this._$featured_image = $('<div class="ct-featured_image"></div>');
    this._$img = $('<img ></img>');

    if (sType === "img") {
      this._$img.attr("src", this._oItem._oVisitItem.url());
    }
    if (sType === "imgres") {
      this._$img.attr("src", this._oItem._oVisitItem._oUrl.dSearch['imgurl']);
    }
    this._$featured_image.append(this._$img);

    // create the item
    this._$item_content.append(this._$featured_image, this._oItemToolbox.$());
  },

});
