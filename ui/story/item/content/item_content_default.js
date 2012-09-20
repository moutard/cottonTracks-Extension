'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Default = Cotton.UI.Story.Item.Content.Element.extend({

  _$featured_image : null,
  _$img : null,

  init : function(oItem) {
    this._super(oItem);

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
        this._oItemToolbox.$(),
        this._oItemDescription.$(),
        this._oItemDna.$()
    );
  },

});
