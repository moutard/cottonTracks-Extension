'use strict';

/**
 * Item content with all the different elements for default item
 */
Cotton.UI.Story.Item.Content.Default = Cotton.UI.Story.Item.Content.Element.extend({

  // parent element
  // _oItem (defined in item_content)

  // current element
  // _$content (defined in item content)

  // sub elements.
  _oItemFeaturedImage : null,
  _oItemTitle : null,
  _oItemDate : null,
  _oItemQuoteIndicator : null,
  _oItemLabel : null,
  _oItemMenu : null,
  _oItemReader : null,

  init : function(oHistoryItem, oItem) {
    this._super(oHistoryItem, oItem);

    this._oItemTitle = new Cotton.UI.Story.Item.Content.Title(oHistoryItem.title(), this);
    this._oItemDate = new Cotton.UI.Story.Item.Content.Date(oHistoryItem.lastVisitTime(), this);
    this._oItemLabel = new Cotton.UI.Story.Item.Content.SmallLabel(oHistoryItem.url(), this);

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.Content.Dna.FeaturedImage(this);
    this._oItemQuoteIndicator = new Cotton.UI.Story.Item.Content.Dna.QuoteIndicator(this);
    this._oItemReader = new Cotton.UI.Story.Item.Content.Dna.Reader(this);

    this._oItemMenu = new Cotton.UI.Story.Item.SmallMenu(this);
    // create the item
    oItem.$().addClass('ct-item-default');
      this._$item_content.append(
        this._oItemFeaturedImage.$(),
        this._$content.append(
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
