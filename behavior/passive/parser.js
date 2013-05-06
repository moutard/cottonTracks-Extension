'use strict';

/**
 * @class : Parser
 *
 * Created by : content_scripts.
 *
 * Find relevant block in a page.
 */

Cotton.Behavior.Passive.Parser = Class
    .extend({
      /**
       * Used to stored the detected best image.
       */
      _sBestImage : null,

      /**
       * All paragraphs, for reader
       */
      _lAllParagraphs : null,

      _oClient : null,

      /*
       * Parameters
       */
      _MIN_PARAGRAPH_WIDTH : null,
      _MIN_BR_FOR_TEXT_CONTAINER : null,
      _MIN_OBJECT_WIDTH : null,
      _MIN_OBJECT_HEIGHT : null,
      _MIN_PRE_WIDTH : null,
      _MIN_PRE_HEIGHT : null,
      _SENTENCE_REGEX : null,

      /**
       *
       */
      init : function(oClient) {
        this._lAllParagraphs = [];
        this._sBestImage = "";
        this._oClient = oClient;
        this.getFirstInfoFromPage(oClient.current());
        this._MIN_PARAGRAPH_WIDTH = 319;
        this._MIN_BR_FOR_TEXT_CONTAINER = 5;
        this._MIN_OBJECT_WIDTH = 400;
        this._MIN_OBJECT_HEIGHT = 300;
        this._MIN_PRE_WIDTH = 400;
        this._MIN_PRE_HEIGHT = 100;
        // Detects sentences containing at least three separate words of at
        // least three
        // letters each.
        // TODO(fwouts): Handle accentuated capitals? Handle languages not
        // following
        // this convention?
        // TODO(fwouts): Find a way to have the final punctuation too (causes an
        // infinite loop
        // on http://api.jquery.com/parent-selector/).
        this._SENTENCE_REGEX = /[A-Z][^.!?]*([\w]{3,} [^.!?]*){3,}/g;
      },

      /**
       *
       * FIXME(rmoutard) : put this in a parser.
       * @param {Cotton.Model.HistoryItem} oHistoryItem.
       */
       getFirstInfoFromPage : function(oHistoryItem) {
         oHistoryItem._sUrl = window.location.href;
         oHistoryItem._sTitle = window.document.title;
         oHistoryItem._iLastVisitTime = new Date().getTime();
         oHistoryItem._sReferrerUrl = document.referrer;
         //oHistoryItem.extractedDNA().setExtractedWords(Cotton.Algo.Tools.extractWordsFromTitle(window.document.title));
       },

      bestImage : function() {
        return this._sBestImage;
      },

      /**
       * Sends a Chrome Extension Message with the meaningful elements inside a
       * tree.
       *
       * @param {Element} node The tree.
       */
      _publishResults : function() {
        var self = this;
        chrome.extension.sendMessage({
          'parsing': 'end',
          'results': {
            'meaningful': self._lAllParagraphs,
            'bestImage': self.bestImage()
          }
        });
      },

      /**
       * Sends a Chrome Extension Message notifying that the parser started.
       *
       * @param {Element} node The tree.
       */
      _publishStart : function() {
        chrome.extension.sendMessage({
          'parsing': 'start'
        });
      },

      /**
       * Parse all the blocks and add the attribute 'data-meaningful', if the
       * block is considered interesting. Then remove the some meaningful
       * blocks.
       */
      parse : function() {
        this._publishStart();
        $('[data-meaningful]').removeAttr('data-meaningful');
        this._findText();
        this.findBestImage();
        this._saveResults();
        this._publishResults();
      },

      /**
       * Parse all the blocks and add the attribute 'data-meaningful', if the
       * block is considered interesting.
       *
       * @returns
       */
      _findText : function() {
        var self = this;
        var oTextWalker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          function(oNode){
            var oParent = oNode.parentNode;
            var sContent = oNode.textContent;
            if (oNode.textContent.indexOf(unescape("%0A")) === -1) {
              if (! Cotton.Utils.ancestor('script, #search', oNode, false)) {
                if (sContent.match(self._SENTENCE_REGEX)
                  && oParent.clientWidth > self._MIN_PARAGRAPH_WIDTH) {
                  if (! Cotton.Utils.ancestor('[data-meaningful], '
                    + 'a, h1, h2, h3, h4, h5, h6, '
                    + '[class*=comments], [class*=Comments], '
                    + '[id*=comments], [id*=Comments], '
                    + '[class*=commentaires], [class*=Commentaires], '
                    + '[id*=commentaires], [id*=Commentaires], '
                    + '[class*=comentarios], [class*=Comentarios], '
                    + '[id*=comentarios], [id*=Comentarios], '
                    + '[class*=footer], [id*=footer], '
                    + '[class*=adsense], [id*=adsense], '
                    + '[class*=promotion], [id*=promotion]',
                    oNode, false)
                    && ! Cotton.Utils.ancestor('[href*="googlead"]', oNode, true))
                  {
                    return NodeFilter.FILTER_ACCEPT
                  }
                }
              }
            }
            return NodeFilter.FILTER_SKIP;
          },
          false
        );
        while(oTextWalker.nextNode()) {
          var oCurrentNode = oTextWalker.currentNode;
          self._markMeaningful(oCurrentNode);
        }
      },

      _markMeaningful : function(oNode) {
        var oParent = oNode.parentNode;
        var oSplit = oParent.innerHTML.split(/<br\/?>/);
        for (var i = 0, len = oSplit.length; i < len; i++) {
          var oFakeElement = document.createElement('span');
          oFakeElement.innerHTML = oSplit[i];
          if (oFakeElement.textContent.match(this._SENTENCE_REGEX)) {
            // Removes whitespace from both ends of the string
            // Replace non-breaking-spaces with ordinary whitespaces
            // Replace new lines with ordinary whitespaces
            // Replace multiple spaces with a single space
            this._lAllParagraphs.push(
              oFakeElement.textContent.trim().replace(/\u00a0/g, ' ')
              .replace(/\n/g, ' ').replace(/ +(?= )/g,''));
          }
        };
        oParent.setAttribute('data-meaningful', 'true');
        oParent.setAttribute('ct-id', this._lAllParagraphs.length);
        if (Cotton.Config.Parameters.bDevMode === true) {
          oParent.style.border = '1px dashed #35d';
        }
      },

      _saveResults : function() {
        var oCurrentHistoryItem = this._oClient.current();
        oCurrentHistoryItem.extractedDNA()
        .setAllParagraphs(this._lAllParagraphs);
        oCurrentHistoryItem.extractedDNA()
        .setFirstParagraph(this._lAllParagraphs[0]);
        oCurrentHistoryItem.extractedDNA().setImageUrl(this._sBestImage);
        this._oClient.setParagraph(this._lAllParagraphs);
        this._oClient.setImage(this._sBestImage);
        this._oClient.updateVisit();
      },

      /**
       * Finds the best image in the whole page.
       *
       * @returns {String} src
       */
      findBestImage : function() {
        var sSrc = this._findSearchImageResult();
        if (sSrc) {
          this._sBestImage = sSrc;
        } else {
          this._sBestImage = this._findBestImageInBlocks($('body'));
        }
        return this._sBestImage;
      },

      /**
       * Finds the best image in a given set of blocks.
       *
       * The idea is mainly to pick the biggest image.
       *
       * TODO(fwouts): Consider the ratio of images, since there could be very
       * narrow images that have a bigger surface than the actual best pick.
       *
       * @returns jQuery DOM representing the given <img /> or null
       */
      _findBestImageInBlocks : function($blocks) {
        var iBiggestScore = 0;
        var iPosition = 0;
        var $biggestImg = null;
        var self = this;

        $blocks.find('img').each(
            function() {
              iPosition += 1;
              var $img = $(this);

              // We only take into account images coming from http://.
              // Interesting
              // fact: sometimes extensions' images were picked (starting with
              // chrome://).
              var src = $img.attr('src');
              // Do not consider images that belong to an <a> if they link to
              // another domain (must be ads)
              // NOTE: does not work if ad is in a "<div
              // onclick:"location.href..>" instead of an <a>
              var sLink = $img.parents('a').attr('href');
              var domainName = function() {
                var lDomain = document.domain.split('.');
                if (/^(www)/i.test(lDomain[0])) {
                  var reg = new RegExp(lDomain[1]);
                } else {
                  var reg = new RegExp(lDomain[0]);
                }
                return reg;
              }();
              var hierarchy = new RegExp("^/|#");
              var bExternalLink = !(sLink == undefined || (domainName
                  .test(sLink) || hierarchy.test(sLink)));
              // Do not take an image which is hidden
              var bHidden = $img.is(':hidden')
                  || $img.css('visibility') == 'hidden'
                  || $img.css('opacity') == 0;
              if (!src || !src.match(/^http:/) || bExternalLink) {
                // Continue the loop.
                return true;
              }
              // Note that we use the node's width and height, not the source
              // image's width and height (since any image could be a very big
              // image stretched down or the vice-versa, but we only care about
              // the layout of the current page).
              var iScore = self._computeImgScore($img, iPosition);
              // TODO: create a single file where we can modify all constants
              // across the app
              var iScoreMin = 3600;
              if (iScore > iBiggestScore && iScore > iScoreMin) {
                iBiggestScore = iScore;
                $biggestImg = $img;
              }
            });

        return $biggestImg ? $biggestImg.attr("src") : undefined;
      },

      /**
       * Finds google image result. When they are included to a google search.
       *
       * @param :
       *          none
       * @returns url of the image
       */
      _findSearchImageResult : function() {
        var sUrl = $("#imagebox_bigimages a.uh_rl").attr("href");
        if (sUrl) {
          var oUrl = new UrlParser(sUrl);
          if(oUrl.isGoogle){
            oUrl.fineDecomposition();
            return oUrl.dSearch['imgurl'];
          }
        }
        return undefined;
      },

      /**
       * Compute the score of an image. The score is higher when the image is
       * higher, when it's first, when data-meaningful equal true.
       *
       * @param $img
       * @param iPosition
       * @return iScore
       */
      _computeImgScore : function($img, iPosition) {
        var iScore = 0;

        /** Surface */
        var iWidth = $img.width();
        var iHeight = $img.height();

        if (iWidth < 200 || iHeight < 120) {
          /**
           * Discriminate pictures too small. Avoid pixel line 3000x1px.
           * Moreover avoid a bad resize.
           */
          return 0;
        }
        var iSurface = iWidth * iHeight;
        // iScore = iSurface;

        /** Data-meaningful */
        if ($img.attr("data-meaningful") === "true") {
          iScore = iScore + 5000;
        }

        /** Position */
        iScore *= (10 / iPosition);
        return iScore;
      },

    });
