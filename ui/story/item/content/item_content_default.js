'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Default = Cotton.UI.Story.Item.Content.Element.extend({

  _oItemFeaturedImage : null,
  _oItemInfo : null,
  _oItemMenu : null,
  _$featured_image : null,
  _$img : null,

  init : function(oItem) {
    this._super(oItem);
    this._oItemFeaturedImage = new Cotton.UI.Story.Item.FeaturedImage(this);
    this._oItemInfo = new Cotton.UI.Story.Item.Info(this);
    this._oItemMenu = new Cotton.UI.Story.Item.Menu(this);

    // create the item
    oItem.$().addClass('ct-item-default');
    this._$item_content.append(
      this._oItemFeaturedImage.$(),
      this._oItemInfo.$(),
      this._oItemMenu.$()
    );
  },

  info : function() {
	  return this._oItemInfo;
  }

});
