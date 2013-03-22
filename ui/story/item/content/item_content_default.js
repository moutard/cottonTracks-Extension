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

    this._sType = "article";
    this._$infos = $('<div class="ct-infos"></div>');
    this._oItemTitle = new Cotton.UI.Story.Item.Content.Brick.Title(
      oHistoryItem.title(), this);
    this._oItemDate = new Cotton.UI.Story.Item.Content.Brick.Date(
      oHistoryItem.lastVisitTime(), this);
    this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.SmallLabel(
      oHistoryItem.url(), this);

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.Content.Brick.Dna.Image(
        oHistoryItem.extractedDNA().imageUrl(), this);
    this._oItemQuoteIndicator = new Cotton.UI.Story.Item.Content.Brick.Dna.QuoteIndicator(
        oHistoryItem.extractedDNA().highlightedText().length, this);

    // create the item
    this._$content.addClass('ct-content_default');
    this._$content.append(
      this._oItemFeaturedImage.$(),
      this._$infos.append(
        this._oItemTitle.$(),
        this._oItemDate.$(),
        this._oItemQuoteIndicator.$(),
        this._oItemLabel.$()
      ),
     this._oToolbox.$()
    );
  }

});
