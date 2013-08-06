'use strict';

/**
 * Item QuoteIndicator shows number of quote in default items
 */
Cotton.UI.Story.Item.Content.Brick.Dna.QuoteIndicator = Class.extend({

  _iQuoteNumber : null,

  // current element.
  _$quote_indicator : null,

  // sub elements.
  _$quoteNumber : null,
  _$quoteIcon : null,

  init : function(iQuoteNumber) {

    this._iQuoteNumber = iQuoteNumber;

    if (iQuoteNumber > 0){
      this.setQuoteIndicator();
    }

  },

  $ : function() {
    return this._$quote_indicator;
  },

  setQuoteIndicator : function(){
    // current element.
    this._$quote_indicator = $('<div class="ct-quote_indicator"></div>');

    // sub elements.
    this._$quote_indicator_icon = $('<img class="ct-quote_indicator_icon" src="media/images/story/item/default_item/quote.png"/>');

    var sQuoteMessage = "Quotes";
    if(this._iQuoteNumber < 2) {sQuoteMessage = "Quote";}
    this._$quote_indicator_number = $('<h4 class="ct-quote_indicator_number">'
        + this._iQuoteNumber +' '+ sQuoteMessage +'</h4>');

    // construct item
    this._$quote_indicator.append(
      this._$quote_indicator_icon,
      this._$quote_indicator_number
    );
  },

  recycle : function (iQuoteNumber){
    if (iQuoteNumber !== 0){
      this._iQuoteNumber = iQuoteNumber;
      this.setQuoteIndicator();
    }
  }

});
