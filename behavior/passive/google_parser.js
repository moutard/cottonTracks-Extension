'use strict';

/**
 * @class : GoogleParser
 * 
 * Created by : content_scripts.
 * 
 * Find relevant block in a google search page. The compisition of search page
 * is really different than a classic page. So It's more relevant to create a
 * new parser.
 */

Cotton.Behavior.Passive.GoogleParser = Class.extend({

  /**
   * true if we should send debugging messages to the JS console.
   * 
   * @type boolean
   */
  _bLoggingEnabled : true,

  log : function(msg) {
    if (this._bLoggingEnabled) {
      console.log(msg);
    }
  },

  init : function() {

  },

  /**
   * Finds google image result. When they are included to a google search.
   * 
   * 
   * @params : none
   * @returns url of the image
   */
  _findSearchImageResult : function() {
    var sUrl = $("#imagebox_bigimages a.bia.uh_rl:first").attr("href");
    var oUrl = new parseUrl(sUrl);
    oUrl.fineDecomposition();
    return oUrl.dSearch['imgurl'];
  },

});