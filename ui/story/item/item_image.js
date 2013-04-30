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

  init : function(oImageUrl, oHistoryItem, oDispatcher) {
    this._super(oHistoryItem, oDispatcher);

    this.setType("image");

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.Content.Brick.Dna.Image(
      oImageUrl, 'full');
    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(oImageUrl,
      this._oDispatcher, this, 'small');

    this._$item.append(
      this._$content.append(
        this._oItemFeaturedImage.$(),
        this._oToolbox.$()
      )
    );
  }

});
