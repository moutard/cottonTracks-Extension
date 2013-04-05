'use strict';

/**
 * Item content with all the different elements for default item
 */
Cotton.UI.Story.Item.Video = Cotton.UI.Story.Item.Element.extend({

  // parent element
  // _oItem (defined in item_content)

  // current element
  // _$content (defined in item content)

  // sub elements.
  _oItemFeaturedImage : null,
  _oToolBox : null,

  init : function(sEmbedCode, sVideoType, oHistoryItem, oDispatcher, oItem) {
    this._super(oHistoryItem,oDispatcher, oItem);

    this._sType = "video";

    this._oVideo = new Cotton.UI.Story.Item.Content.Brick.Dna.Video(
      sEmbedCode, sVideoType, this);
    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(oHistoryItem.url(),
      this._oDispatcher, this, 'large');

    this._$item.append(
      this._$content.append(
        this._oVideo.$(),
        this._oToolbox.$()
      )
    );
  }

});
