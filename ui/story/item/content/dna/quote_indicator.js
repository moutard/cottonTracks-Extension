'use strict';

/**
 * Item QuoteIndicator shows number of quote in default items
 */
Cotton.UI.Story.Item.Content.Dna.QuoteIndicator = Class.extend({

  // parent element.
  _oItemContent : null,

  _iQuoteNumber : null,

  // current element.
  _$quote_indicator : null,

  // sub elements.
  _$quoteNumber : null,
  _$quoteIcon : null,

  init : function(iQuoteNumber, oItemContent) {

    this._iQuoteNumber = iQuoteNumber;

    // parent element.
    this._oItemContent = oItemContent;

    // current element.
    this._$quote_indicator = $('<div class="ct-quote_indicator"></div>');

    // sub elements.
    this._$quote_indicator_icon = $('<img class="ct-quote_indicator_icon" src="media/images/story/item/default_item/quote.png"/>');

    if(iQuoteNumber > 0){
      this._$quote_indicator_number = $('<h4 class="ct-quote_indicator_number">'
          + iQuoteNumber +' Quotes</h4>');

      // construct item
      this._$quote_indicator.append(
        this._$quote_indicator_icon,
        this._$quote_indicator_number
      );
    }

  },

  $ : function() {
    return this._$quote_indicator;
  }

});
