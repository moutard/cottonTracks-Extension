"use strict";

// Class responsible for the sharing of a single card,
// through several services

Cotton.UI.Stand.Story.Card.Content.Sharer = Class.extend({

  init : function(oHistoryItem, oLocalDispatcher) {
    var self = this;
    this._oLocalDispatcher = oLocalDispatcher;

    this._$sharer = $('<div class="ct-sharer ct-closed"></div>');
    this._$share_icon = $('<div class="ct-share_icon"></div>').click(function(){
      if (!self._$sharer.hasClass('ct-open')) {
        self.selectSharingNetwork(oHistoryItem);
        self._$sharer.toggleClass('ct-open ct-closed');
      } else {
        self.purgeSharingNetwork();
        self._$sharer.toggleClass('ct-open ct-closed');
      }
    });
    this._$sharer.append(this._$share_icon);

    this._oLocalDispatcher.subscribe('media_async_image', this, function(dArguments){
      this._sImageUrl = dArguments['img_url'];
    });
  },

  $ : function() {
    return this._$sharer;
  },

  selectSharingNetwork : function(oHistoryItem) {
    var self = this;
    this._$networks = $('<div class="ct-sharer_networks"></div>');
    var sEncodedUrl = encodeURIComponent(oHistoryItem.url());
    var sEncodedTitle = encodeURIComponent(oHistoryItem.title());
    var sEncodedImage = this._sImageUrl || oHistoryItem.extractedDNA().imageUrl() || "";

    // Facebook.
    var sFacebookDialog = "https://www.facebook.com/sharer/sharer.php?s=100&p%5Burl%5D="+ sEncodedUrl
      + "&p%5Btitle%5D=" + sEncodedTitle
      + "&p%5Bsummary%5D=" + "shared+via+cottonTracks"
      + "&p%5Bimages%5D%5B0%5D=" + sEncodedImage;
    this._$facebook = $('<a class="ct-card_share ct-facebook_share" href="'+ sFacebookDialog +'">Facebook</a>').click(function(){
      Cotton.ANALYTICS.shareCard('facebook');
      return self.openPopup(sFacebookDialog);
    });

    // Twitter.
    var sTwitterIntent = "https://twitter.com/intent/tweet"
      + "?via=" + "cottonTracks"
      + "&text=" + sEncodedTitle
      + "&url=" + sEncodedUrl;
    this._$twitter = $('<a class="ct-card_share ct-twitter_share" href="' + sTwitterIntent +'">Twitter</a>').click(function(){
      Cotton.ANALYTICS.shareCard('twitter');
      return self.openPopup(sTwitterIntent);
    });

    // Mail.
    var sMailto = "mailto:?"
      + "&amp;subject=" + sEncodedTitle
      + "&amp;body=" + sEncodedUrl + "%0D%0DShared%20via%20cottonTracks";
    this._$mailto = $('<a class="ct-card_share ct-mailto_share" href="'+ sMailto + '" target="_blank">email</a>').click(function(){
      Cotton.ANALYTICS.shareCard('email');
    });

    this._$sharer.append(
      this._$networks.append(
        this._$facebook,
        this._$twitter,
        this._$mailto
      )
    );
  },

  openPopup : function(sUrl) {
    window.open(sUrl,'popup','width=600,height=500,scrollbars=yes,resizable=yes,menubar=no,status=no,left=50,top=50');
    return false;
  },

  purgeSharingNetwork : function() {
    this._$facebook.remove();
    this._$facebook = null;
    this._$twitter.remove();
    this._$twitter = null;
    this._$mailto.remove();
    this._$mailto = null;
    this._$networks.remove();
    this._$networks = null;
  },

  purge : function() {
    if (this._$sharer.hasClass('ct-open')) {
      this.purgeSharingNetwork();
    }
    this._oLocalDispatcher.unsubscribe('media_async_image', this);
    this._oLocalDispatcher = null;
    this._$share_icon.unbind('click').remove();
    this._$share_icon = null;
    this._$sharer.remove();
    this._$sharer = null;
  }
});