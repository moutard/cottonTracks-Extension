'use strict';

/**
 * Item QuoteIndicator shows number of quote in default items
 */
Cotton.UI.Story.Item.QuoteIndicator = Class
    .extend({

      _oItemContent : null,

			_$itemQuoteIndicator : null,
			_$quoteNumber : null,
			_$quoteIcon : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

				//current element.
				this._$itemQuoteIndicator = $('<div class="ct-quote"></div>');

				//current sub elements.				
        var quoteNumber =  this._oItemContent.item().visitItem().extractedDNA().highlightedText().length;
        this._$quoteIcon = $('<img class="quote_indicator_icon" src="media/images/story/item/default_item/quote.png"/>');

        if(quoteNumber > 0){
          this._$itemQuoteNumber = $('<h4 class="quote_indicator_text">' + quoteNumber +' Quotes</h4>');

	        // construct item
	        this._$itemQuoteIndicator.append(
						self._$quoteIcon,
						self._$itemQuoteNumber
					);
        }

      },

      $ : function() {
        return this._$itemQuoteIndicator;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$itemQuoteIndicator);
      },

    });
