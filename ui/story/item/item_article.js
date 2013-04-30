'use strict';

/**
 * Item content with all the different elements for default item
 */
Cotton.UI.Story.Item.Article = Cotton.UI.Story.Item.Element.extend({

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

  init : function(oHistoryItem, oDispatcher) {
    this._super(oHistoryItem, oDispatcher);

    this.setType("article");

    this._$infos = $('<div class="ct-infos"></div>');
    this._oItemTitle = new Cotton.UI.Story.Item.Content.Brick.Title(
      oHistoryItem.title(), this, oHistoryItem.url());
    this._oItemDate = new Cotton.UI.Story.Item.Content.Brick.Date(
      oHistoryItem.lastVisitTime());
    this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.SmallLabel(
      oHistoryItem.url());

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.Content.Brick.Dna.Image(
        oHistoryItem.extractedDNA().imageUrl(), 'featured');
    this._oItemQuoteIndicator = new Cotton.UI.Story.Item.Content.Brick.Dna.QuoteIndicator(
        oHistoryItem.extractedDNA().highlightedText().length);

    var oDNA = oHistoryItem.extractedDNA();
    var bHasExpand = this.hasExpand(oDNA);

    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Complexe(bHasExpand,
        oHistoryItem.url(), this._oDispatcher, this, 'small');

    this._oReader = new Cotton.UI.Story.Item.Content.Brick.Dna.Reader(
        oDNA);


    this._$item.append(
      this._$content.append(
        this._oItemFeaturedImage.$(),
        this._$infos.append(
          this._oItemTitle.$(),
          this._oItemDate.$(),
          this._oItemQuoteIndicator.$(),
          this._oItemLabel.$()
        ),
       this._oToolbox.$()
      ),
      this._oReader.$()
    );
  },

  hasExpand : function(oDNA){
    return ((oDNA.allParagraphs().length > 0)
      || (oDNA.paragraphs().length > 0)
      || (oDNA.firstParagraph() != ""));
  },

  recycle : function(oHistoryItem) {
    var self = this;
    this._oHistoryItem = oHistoryItem;
    this._oItemFeaturedImage.recycle(oHistoryItem.extractedDNA().imageUrl());
    this._oItemQuoteIndicator.recycle(
      oHistoryItem.extractedDNA().highlightedText().length);
    this._oToolbox.recycle(self.hasExpand(oHistoryItem.extractedDNA()));
    this._oReader.recycle(oHistoryItem.extractedDNA(), self.hasExpand(
      oHistoryItem.extractedDNA()));
  }
});
