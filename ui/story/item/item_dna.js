'use strict';

/**
 * Item Dna NOT USED YET.
 */
Cotton.UI.Story.Item.Dna = Class
    .extend({

      _oItemContent : null,

      _$item_dna : null,

      _$quote : null,

      init : function(oItemContent) {
        // current parent element.
        this._oItemContent = oItemContent;

        // current item.
        this._$item_dna = $('<div class="ct-item_dna"></div>');

        // current sub elements
        this._$quote = $('<div class="ct-item_quote"></div>');

        // set values

        // TextHighlight
        if (this._oItemContent._oItem._oVisitItem.extractedDNA()
            .highlightedText().length !== 0) {
          this._$quote.text(oVisitItem.extractedDNA().highlightedText()[0]);
        } else {
          this._$quote = null;
        }

        if (this._$quote) {
          this._$item_dna.append(this._$quote);
        } else {
          this._$item_dna = null;
        }

      },

      $ : function() {
        return this._$item_dna;
      },

      appendTo : function(oStoryLine) {
        this._oItemContent.$().append(this._$item_dna);
      },

    });
