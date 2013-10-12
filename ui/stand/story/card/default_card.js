"use strict";

/**
 * Class for default cards, extends the Card class
 **/
Cotton.UI.Stand.Story.Card.Default = Cotton.UI.Stand.Story.Card.Card.extend({
  /**
   * {DOM} media container, left part of the card, with potiential featured image
   */
  _$media : null,

  /**
   * {Cotton.UI.Stand.Story.Card.Content.QuoteHolder} object that creates, contains and places
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

    this.setType('default');

    this._oQuoteHolder = new Cotton.UI.Stand.Story.Card.Content.QuoteHolder(oHistoryItem, oGlobalDispatcher);

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
        this._oQuoteHolder.$(),
        this._$url
      ),
      this._$delete,
      this._oWebsite.$()
    );
  },

  setHeight : function() {
    // the card needs to have a well defined height (auto doesn't work) in order for the
    // image to resize properly
    // it is important to call it only when the quotes are attached to the DOM,
    // otherwise their height will be 0. So setHeight is called from the StoryBoard, after
    // the card is created and appended (see Cotton.UI.Stand.Story.StoryBoard)
    if (this._oQuoteHolder.$()) {
      var MARGIN = 40;
      this._$card.height(this._oQuoteHolder.$().height() + 2 * MARGIN);
    } else {
      var DEFAULT_HEIGHT = 105;
      this._$card.height(DEFAULT_HEIGHT);
    }
  },

  purge : function() {
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