'use strict';

/**
 * Card website contains favicon and website domain.
 */
Cotton.UI.Stand.Story.Card.Content.Website = Class.extend({


  /**
   * dom element containing the favicon and website domain
   */
  _$website : null,

  /**
   * dom element containing the favicon and website domain
   * @param {string} sUrl:
   *    url of the historyItem
   */
  init : function(sUrl, oLocalDispatcher) {
    var self = this;
    this._oLocalDispatcher = oLocalDispatcher;

    // dom element that contains the favicon and website domain
    this._$website = $('<div class="ct-card_website"></div>');

    // we only display en.wikipedia.org from the full url
    // en.wikipedia.org/wiki/Link_(The_Legend_of_Zelda)
    var oUrl = new UrlParser(sUrl);
    var $domain = $('<div class="ct-card_domain">' + oUrl.hostname + '</div>');

    // favicon using core API.
    var $favicon = $('<img class="ct-card_favicon" src="' + self.faviconUrl(sUrl) +'">');

    // construct item.
    this._$website.append(
      $favicon,
      $domain
    );

    // local dispatcher, remove $website when an iframe is appended
    this._oLocalDispatcher.subscribe('load_video', this, function(){
      this._$website.fadeOut(function(){$(this).remove()});
    });
  },

  $ : function() {
    return this._$website;
  },

  /**
   * this calls the core API to get the favicon
   * @param {string} sUrl:
   *    url of the historyItem
   *
   * >returns {string}
   *    chrome://favicon/sUrl or opera://favicon/sUrl
   */
  faviconUrl : function(sUrl) {
    var oFavicon = new Cotton.Core.Favicon();
    return oFavicon.getSrc() + sUrl;
  },


  purge : function() {
    this._oLocalDispatcher.unsubscribe('load_video', this);
    this._oLocalDispatcher = null;

    this._$website.empty().remove();
    this._$website = null;
  }

});
