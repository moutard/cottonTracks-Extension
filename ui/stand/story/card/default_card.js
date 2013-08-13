"use strict";

/**
 * Class for default cards, extends the Card class
 **/
Cotton.UI.Stand.Story.Card.Default = Cotton.UI.Stand.Story.Card.Card.extend({

  /**
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDispatcher
   **/
  init : function(oHistoryItem, oGlobalDispatcher) {
    // init with the parent card class
    this._super(oHistoryItem, oGlobalDispatcher);

    this.setType('default');

    // featured image
    var sImage = oHistoryItem.extractedDNA().imageUrl();
    if (sImage) {
      // featured image, create only if there is one
      this._oFeaturedImage = new Cotton.UI.Stand.Story.Card.Content.ImageFeatured(sImage);
      this._$media = this._oFeaturedImage.$();
    }

    this.drawCard();
  },

  drawCard : function() {
    // if there is no media, the website on the bottom left must be written in black
    if (!this._$media) {
      this._oWebsite.$().addClass('ct-black_domain');
    }

    this._$card.append(
      this._$media,
      this._$details.append(
        this._oTitle.$(),
        this._$url
      ),
      this._$delete,
      this._oWebsite.$()
    );
  },

  purge : function() {
    if (this._oFeaturedImage) {
      this._oFeaturedImage.purge();
      this._oFeaturedImage = null;
    }
    this._super();
  }
});