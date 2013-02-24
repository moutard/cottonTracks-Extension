'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Default = Cotton.UI.Story.Item.Content.Element.extend({

  _$featured_image : null,
  _$img : null,

  init : function(oItem) {
    this._super(oItem);
    // create the item
    oItem.$().addClass('ct-item-default');
		this._$item_content.append(
        this._oItemFeaturedImage.$(),
        this._oItemInfo.$(),
        this._oItemDna.$()
    );
  },

});
