'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Default = Cotton.UI.Story.Item.Content.Element.extend({

  _oItemFeaturedImage : null,
  _$itemInfo : null,
  _oItemTitle : null,
  _oItemDate : null,
  _oItemQuoteIndicator : null,
  _oItemLabel : null,
  _oItemMenu : null,
  _oItemReader : null,

  init : function(oItem) {
    this._super(oItem);
    this._oItemFeaturedImage = new Cotton.UI.Story.Item.FeaturedImage(this);
    this._$itemInfo = $('<div class="ct-item_info"></div>');
    this._oItemTitle = new Cotton.UI.Story.Item.Title(this);
    this._oItemDate = new Cotton.UI.Story.Item.Date(this);
    this._oItemQuoteIndicator = new Cotton.UI.Story.Item.QuoteIndicator(this);
    this._oItemLabel = new Cotton.UI.Story.Item.SmallLabel(this);
    this._oItemMenu = new Cotton.UI.Story.Item.SmallMenu(this);
    this._oItemReader = new Cotton.UI.Story.Item.Reader(this);

    // create the item
    oItem.$().addClass('ct-item-default');
      this._$item_content.append(
        this._oItemFeaturedImage.$(),
        this._$itemInfo.append(
          this._oItemTitle.$(),
          this._oItemDate.$(),
          this._oItemQuoteIndicator.$(),
          this._oItemLabel.$(),
          this._oItemMenu.$()
        ),
       this._oItemReader.$()
      );
    },

});
