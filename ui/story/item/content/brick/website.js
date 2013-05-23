'use strict';

/**
 * Item Website Contains favicon and website url.
 */
Cotton.UI.Story.Item.Content.Brick.Website = Class.extend({

  _sUrl : null,

  // current element.
  _$website : null,

  // sub elements.
  _$favicon : null,
  _$url : null,

  init : function(sUrl) {

    this._sUrl = sUrl;

    // current element.
    this._$website = $('<div class="ct-item_content_website"></div>');

    // sub elements.

    // url.
    this._$url = $('<div class="url"></div>');
    // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
    var oUrl = new UrlParser(sUrl);
    var sDomain = oUrl.hostname;
    this._$url.text(sDomain);

    // favicon using chrome API.
    var oRegExp = /www.google.[a-z]{2,3}|www.google.[a-z]{2,3}.[a-z]{2,3}/ig;
    // we treat google differently because favicon api only retrieves favicon for urls that
    // have been actually visited by the user, but we standardize google urls.
    if (sDomain.match(oRegExp)){
      this._$favicon = $('<img class="favicon" src="http://www.google.com/images/google_favicon_128.png">');
    } else {
      this._$favicon = $('<img class="favicon" src="opera://favicon/'+sUrl+'">');
    }

    // construct item.
    this._$website.append(
      this._$favicon,
      this._$url
    );

  },

  url : function() {
    return this._sUrl;
  },

  $ : function() {
    return this._$website;
  },

});
