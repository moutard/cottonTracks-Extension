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
       * Used to stored the detected favicon.
       */
      _sFavicon : null,

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

      _sImage : null,

      /**
       * @constructor
       */
      init : function() {
        this._super();

        this._MeaningFulBlocks = [];
        this._iNbMeaningfulBlock = 0;
      },

      favicon : function() {
        return this._sFavicon;
      },

      bestImage : function() {
        return this._sBestImage;
      },

      /**
       * Parse all the blocks and add the attribute 'data-meaningful', if the
       * block is considered interesting. Then remove the some meaningful
       * blocks.
       */
      parse : function() {

        // Find the favicon
        var sFavicon = $("link[rel$=icon]").attr("href");
        var oRegexp = new RegExp("^http://");
        if (!oRegexp.test(sFavicon)) {
          sFavicon = window.location.origin + '/' + sFavicon;
        }
        this._sFavicon = sFavicon;

        sync.current().setFavicon(this._sFavicon);
        sync.updateVisit();

        // Detect inforbox.
        this._$InfoBox = $('.infobox');
        if (this._$InfoBox.length == 0) {
          this._$InfoBox = $('.infobox_v2');
        } else if (this._$InfoBox.length == 0) {
          this._$InfoBox = $('.infobox_v3');
        }

        $('[data-meaningful]').removeAttr('data-meaningful');
        this._findMeaningfulBlocks();
        this._removeLeastMeaningfulBlocks();

        this.findBestImage();
      },

      /**
       * Finds the best image in the whole page. If there is an image in the
       * infobox choose this one. Else find other image.
       * 
       * @returns jQuery DOM representing the given <img /> or null
       * @returns src
       */
      findBestImage : function() {
        var self = this;
        if (self._$InfoBox) {
          self._sBestImage = self._$InfoBox('.image:first img').attr('src');
          // Get the first one, but we can do much better.
        } else {
          self._sBestImage = $('div.thumbinner:first img').attr('src');
        }
        return self._sBestImage;
      },

    });
