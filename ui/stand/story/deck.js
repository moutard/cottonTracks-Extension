"use strict";

/**
 * Deck
 *
 * Contains all the cards.
 */
Cotton.UI.Stand.Story.Deck = Class.extend({
  /**
   * {DOM} current element.
   */
  _$deck : null,

  init : function(oStory, oGlobalDispatcher) {

    this._$card_deck = $('<div class="ct-story_card_deck"></div>');
  },

  $ : function() {
    return this._$card_deck;
  },

  drawCards : function() {

  },

  purge : function() {
    this._$card_deck.remove();
    this._$card_deck = null;
  }

});