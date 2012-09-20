'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Search = Cotton.UI.Story.Item.Content.Element.extend({

  _$featured_image : null,
  _$img : null,

  init : function(oItem) {
    this._super(oItem);

    // set favicon
    this._oItemToolbox._$favicon.attr("src",
        "/media/images/story/google_favicon.png");

    // set image
    this._$featured_image = $('<div class="ct-featured_image"></div>');
    this._$img = $('<img ></img>');
    if(this._oItem.visitItem().extractedDNA().imageUrl() !== ""){
      this._$img.attr('src', this._oItem.visitItem().extractedDNA().imageUrl());
      this._$featured_image.append(this._$img);

    }

    // create the item
    this._$item_content.append(
        this._$featured_image,
        this._oItemDescription.$(),
        this._oItemToolbox.$()
        );
  },

});
