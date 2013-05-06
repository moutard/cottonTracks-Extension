'use strict';

/**
 * Wikipedia Parser
 *
 * Created by : content_scripts.
 *
 * Find relevant block in a wikipedia page. The compisition of wikipedia page is
 * really specific. So It's more relevant to create a new parser.
 */

Cotton.Behavior.Passive.WikipediaParser = Cotton.Behavior.Passive.Parser
    .extend({

      /**
       * Used to stored the detected best image.
       */
      _sBestImage : null,

      /**
       * Meaningful blocks
       */
      _lMeaningfulBlocks : null,

      /**
       * The box on the left, that contains specific informations. This
       * corresponds to .infobox or .infobox_v2 class.
       */
      _$InfoBox : undefined,

      /**
       * All paragraphs, for reader
       */
      _lAllParagraphs : null,

      /**
       *
       */
      init : function(oClient) {
        this._super(oClient);

        this._MeaningFulBlocks = [];
        this._iNbMeaningfulBlock = 0;
        this._lAllParagraphs = [];
        this._sBestImage = "";
      },

      /**
       * Parse all the blocks and add the attribute 'data-meaningful', if the
       * block is considered interesting. Then remove the some meaningful
       * blocks.
       */
      parse : function() {

        // Detect inforbox.
        this._$InfoBox = $('.infobox');
        if (this._$InfoBox.length === 0) {
          this._$InfoBox = $('.infobox_v2');
        }
        if (this._$InfoBox.length === 0) {
          this._$InfoBox = $('.infobox_v3');
        }

        $('[data-meaningful]').removeAttr('data-meaningful');
        this._findText();
        this.findBestImage();
        this._saveResults();
        this._publishResults();
      },

      /**
       * Finds the best image in the wikipedia page. If there is an image in the
       * infobox choose this one. Else find other image in thumbinner.
       *
       * @returns {String} src
       */
      findBestImage : function() {
        if (this._$InfoBox.length !== 0) {
          this._sBestImage = this._$InfoBox.find('.image:first img')
              .attr('src');
          // Get the first one, but we can do much better.
        } else {
          this._sBestImage = $('div.thumbinner:first img').attr('src');
        }
        if (this._sBestImage && this._sBestImage.slice(0,2) === "//"){
          this._sBestImage = "http:" + this._sBestImage;
        }
        this._oClient.current().extractedDNA().setImageUrl(this._sBestImage);
        this._oClient.setImage(this._sBestImage);
        this._oClient.updateVisit();
        return this._sBestImage;
      },

    });
