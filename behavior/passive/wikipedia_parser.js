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
      init : function(oClient, oMessenger) {
        this._super(oClient, oMessenger);

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
        $('[data-skip]').removeAttr('data-skip');
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
          var lImages = this._$InfoBox.find('.image img');
          this.checkImage(lImages);
          // Get the first one, but we can do much better.
        }
        if (!this._sBestImage || this._sBestImage === "" ) {
          var lImages = $('div.thumbinner img');
          this.checkImage(lImages);
        }
        if (!this._sBestImage || this._sBestImage === "" ) {
          var lImages = $('.navbox img');
          this.checkImage(lImages);
        }
        if (this._sBestImage && this._sBestImage.slice(0,2) === "//"){
          this._sBestImage = "http:" + this._sBestImage;
        }
        this._oClient.current().extractedDNA().setImageUrl(this._sBestImage);
        this._oClient.updateVisit();
        return this._sBestImage;
      },

      checkImage : function(lImages){
        lImages = lImages || [];
        for (var i = 0, $image; $image = lImages[i]; i++){
          if ($image.height >= 50 && $image.width >= 50){
            this._sBestImage = $image.src;
            break;
          }
        }
      }

    });
