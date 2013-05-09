'use strict';

/**
 * Google Image Preview Parser
 *
 * Created by : content_scripts.
 *
 * Find images clicked in a google result page.
 */

Cotton.Behavior.Passive.GoogleImageParser = Cotton.Behavior.Passive.Parser.extend({
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
     if (this._oUrl.searchImage){
       oHistoryItem._sUrl = this._oUrl.searchImage;
       oHistoryItem._sFeaturedImage = this._oUrl.searchImage;
     } else {
       oHistoryItem._sUrl = this._oUrl.genericSearch + "&tbm=isch";
     }
     oHistoryItem._sTitle = window.document.title;
     oHistoryItem._iLastVisitTime = new Date().getTime();
     oHistoryItem._sReferrerUrl = document.referrer;
   },
});
