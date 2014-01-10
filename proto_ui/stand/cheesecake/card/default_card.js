"use strict";

/**
 * Class for default cards, extends the Card class
 **/
Cotton.UI.Stand.Cheesecake.Card.Default = Cotton.UI.Stand.Cheesecake.Card.Card.extend({
  /**
   * {DOM} media container, left part of the card, with potiential featured image
   */
  _$media : null,

  /**
   * {Cotton.UI.Stand.Cheesecake.Card.Content.QuoteHolder} object that creates, contains and places
   * the quotes
   */
  _oQuoteHolder : null,

  /**
   * {DOM} dom container with all the quotes
   */
  _$quote_holder : null,

  /**
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oHistoryItem, oGlobalDispatcher) {
    // init with the parent card class
    this._super(oHistoryItem, oGlobalDispatcher);

    this._$details = $('<div class="ct-card_details"></div>');
    this._oTitle = new Cotton.UI.Stand.Cheesecake.Card.Content.Title(oHistoryItem);
    this._oTitle.$().click(function(){
      Cotton.ANALYTICS.revisitPage(self._sType);
    });
    this._$url = $('<div class="ct-card_url">' + oHistoryItem.url() +'</div>');

    this._oGlobalDispatcher = oGlobalDispatcher;

    this.setType('default');

    this._oQuoteHolder = new Cotton.UI.Stand.Cheesecake.Card.Content.QuoteHolder(oHistoryItem, oGlobalDispatcher);

    var sImage = oHistoryItem.extractedDNA().imageUrl();
    if (sImage) {
      // featured image, create only if there is one
      this._oFeaturedImage = new Cotton.UI.Stand.Cheesecake.Card.Content.ImageFeatured(sImage);
      this._$media = this._oFeaturedImage.$();
    }

    this.drawCard();
  },

  drawCard : function() {
    this._$card.append(
      this._$media,
      this._$details.append(
        this._oTitle.$(),
        this._oQuoteHolder.$(),
        this._$url,
        this._$tags
      ),
      this._$overlay,
      this._$delete
    );
  },

  purge : function() {
    // this._oGlobalDispatcher is nullified in _super
    if (this._oFeaturedImage) {
      this._oFeaturedImage.purge();
      this._oFeaturedImage = null;
    }
    if (this._oQuoteHolder) {
      this._oQuoteHolder.purge();
      this._$quote_holder = null;
    }
    this._super();
  }
});