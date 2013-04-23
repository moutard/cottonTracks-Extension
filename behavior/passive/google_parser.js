'use strict';

/**
 * Google Parser
 *
 * Created by : content_scripts.
 *
 * Find relevant block in a google result page.
 */

Cotton.Behavior.Passive.GoogleParser = Cotton.Behavior.Passive.Parser.extend({
  /**
   * Used to stored the detected best image.
   */
  _sBestImage : null,

  /**
   * Meaningful blocks
   */
  _lMeaningfulBlocks : null,

  /**
   * The box on the left, that contains specific informations. This corresponds
   * to .infobox or .infobox_v2 class.
   */
  _$rhsBox : undefined,

  /**
   *
   */
  init : function(oClient, oUrl) {
    this._oUrl = oUrl;
    this._super(oClient);
  },

  /**
   *
   * FIXME(rmoutard) : put this in a parser.
   * @param {Cotton.Model.HistoryItem} oHistoryItem.
   */
   getFirstInfoFromPage : function(oHistoryItem) {
     oHistoryItem._sUrl = this._oUrl.genericSearch;
     oHistoryItem._sTitle = window.document.title;
     oHistoryItem._iLastVisitTime = new Date().getTime();
     oHistoryItem._sReferrerUrl = document.referrer;
   },

  /**
   * Parse all the blocks and add the attribute 'data-meaningful', if the block
   * is considered interesting. Then remove the some meaningful blocks.
   */
  parse : function() {

   // Detect rhsbox.
    this._$InfoBox = $('#rhs'); // seems it doesn't work.

    $('[data-meaningful]').removeAttr('data-meaningful');
    this._findMeaningfulBlocks();
    this._removeLeastMeaningfulBlocks();

    this.findBestImage();
  },

  /**
   * Finds google image result. When they are included to a google search.
   *
   * @param :
   *          none
   * @returns url of the image
   */
  _findSearchImageResult : function() {
    var sUrl = $("#imagebox_bigimages a.uh_rl:first").attr("href");
    if (sUrl) {
      if (sUrl[0] === "/") {
        sUrl = "http://google.fr" + sUrl;
      }
      var oUrl = new UrlParser(sUrl);
      oUrl.fineDecomposition();
      return oUrl.dSearch['imgurl'];
    }

    return undefined;
  },

  /**
   * Finds google image result when it's actuality.
   *
   * @param :
   *          none
   * @returns url of the image
   */
  _findActualityImageResult : function() {
    return undefined;
  },

  /**
   * Finds the best image in the wikipedia page. If there is an image in the
   * infobox choose this one. Else find other image in thumbinner.
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

});
