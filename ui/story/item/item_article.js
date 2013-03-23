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

  init : function(oHistoryItem, oDispacher, oStory) {
    this._super(oDispacher, oStory);

    this.setType("article");

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

    var oDNA = oHistoryItem.extractedDNA();
    var bHasExpand = ((oDNA.allParagraphs().length > 0)
      || (oDNA.paragraphs().length > 0)
      || (oDNA.firstParagraph() != ""));

    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Complexe(bHasExpand, false,
        oHistoryItem.url(), this._oDispacher, this);

    this._oReader = new Cotton.UI.Story.Item.Content.Brick.Dna.Reader(
        oDNA, this);


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
  }

});
