'use strict';

/**
 * Wikipedia Parser
 *
 * Created by : content_scripts.
 *
 * Find relevant block in a wikipedia page. The compisition of wikipedia page
 * is really specific. So It's more relevant to create a new parser.
 */

Cotton.Behavior.Passive.WikipediaParser = Cotton.Behavior.Passive.Parser.extend({

  _$InfoBox : undefined,
  _sImage : null,

  init : function() {
    this._super();

    this._$InfoBox = $('.infobox');
    if(this._$InfoBox){
      this._sImage = this._$InfoBox('img:first').attr("src");
    }
  },

  /**
   * Finds google image result. When they are included to a google search.
   *
   *
   * @param : none
   * @returns url of the image
   */
  _findSearchImageResult : function() {
    var sUrl = $("#imagebox_bigimages a.bia.uh_rl:first").attr("href");
    var oUrl = new parseUrl(sUrl);
    oUrl.fineDecomposition();
    return oUrl.dSearch['imgurl'];
  },

});
