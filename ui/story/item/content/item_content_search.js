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
        "/media/images/story/item/google_favicon.png");

    // create the item
    this._$item_content.append(
        this._oItemFeaturedImage.$(),
        this._oItemDescription.$(),
        this._oItemToolbox.$()
        );
  },

});
