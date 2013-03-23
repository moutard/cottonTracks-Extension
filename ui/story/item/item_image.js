'use strict';

/**
 * Item content with all the different elements for default item
 */
Cotton.UI.Story.Item.Image = Cotton.UI.Story.Item.Element.extend({

  // parent element
  // _oItem (defined in item_content)

  // current element
  // _$content (defined in item content)

  // sub elements.
  _oItemFeaturedImage : null,
  _oToolBox : null,

  init : function(oImageUrl, oDispacher, oItem) {
    this._super(oDispacher, oItem);

    this._sType = "image";

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.Content.Brick.Dna.Image(
      oImageUrl, this);
    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(oImageUrl,
      this._oDispacher, this);

    this._$item.append(
      this._$content.append(
        this._oItemFeaturedImage.$(),
        this._oToolbox.$()
      )
    );
  }

});
