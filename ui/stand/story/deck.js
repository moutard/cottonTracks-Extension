"use strict";

/**
 * Deck
 *
 * Contains all the cards.
 */
Cotton.UI.Stand.Story.Deck = Class.extend({
  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} right column of the story, with all the cards
   */
  _$card_deck : null,

  /**
   * {array} array containing all the card objects
   */
  _lCards : null,

  init : function(oStory, oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$card_deck = $('<div class="ct-story_card_deck"></div>');
    this._lCards = [];

  },

  $ : function() {
    return this._$card_deck;
  },

  /**
   * place all the cards in the deck
   * @param {Cotton.Model.Story} oStory:
   *    story to be drawn
   **/
  drawCards : function(oStory) {
    var lHistoryItems = oStory.historyItems();
    var iLength = lHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      var oCard = new Cotton.UI.Stand.Story.Card.Factory(oHistoryItem, this._oGlobalDispatcher);
      this._lCards.push(oCard);
      this._$card_deck.append(oCard.$());
      // set height of the card, needed for default cards with quotes, before appending the
      // featured image. -> See Cotton.UI.Stand.Story.Card.Default
      oCard.setHeight();
    }
  },

  purgeCards : function() {
    var iLength = this._lCards.length;
    for (var i = 0; i < iLength; i++) {
      this._lCards[i].purge();
      this._lCards[i] = null;
    }
    this._lCards = null;
  },

  purge : function() {
    this._oGlobalDispatcher = null;
    this.purgeCards();
    this._$card_deck.remove();
    this._$card_deck = null;
  }

});