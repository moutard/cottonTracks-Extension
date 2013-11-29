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

    this._$card_deck = $('<div class="ct-story_deck ct-card_deck"></div>');
    this._lCards = [];

    this._oCardFactory = new Cotton.UI.Stand.Story.Card.Factory();

    this._oGlobalDispatcher.subscribe('remove_card', this, function(dArguments) {
      this.removeCard(dArguments['history_item_id']);
    });

    this._oGlobalDispatcher.subscribe('pool_items', this, function(dArguments){
      // the "add card" button has been clicked, open the card_adder and fill it with
      // the pool items
      this.fillCardAdderWithItems(oStory, dArguments['items']);
    });

    this._oGlobalDispatcher.subscribe('append_new_card', this, function(dArguments){
      // a pool item has been selected in the card_adder.
      // Create a new card and prepend it to the card deck.
      this.prependCard(dArguments['history_item']);
    });
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
    this.placeCardAdder(oStory.id());
    var lHistoryItems = oStory.historyItems();
    var iLength = lHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      var oCard = this._oCardFactory.get(oHistoryItem, this._oGlobalDispatcher);
      this._lCards.push(oCard);
      this._$card_deck.append(oCard.$());
      // set height of the card, needed for default cards with quotes, before appending the
      // featured image. -> See Cotton.UI.Stand.Story.Card.Default
      oCard.initHeight();
    }
  },

  /**
   * place the card adder
   * @param {int} iStoryId
   *    story that will have some cards added to if the card adder is used
   **/
  placeCardAdder : function(iStoryId) {
    this._oCardAdder = new Cotton.UI.Stand.Story.Card.CardAdder(iStoryId, this._oGlobalDispatcher);
    this._$card_deck.append(this._oCardAdder.$());
  },

  /**
   * place all the cards one by one
   * @param {Cotton.Model.Story} oStory:
   *    story that will serve the sorting by score of the pool items
   * @param {array of Cotton.Model.HistoryItems} lPoolItems:
   *    items from the pool, already filtered
   **/
  fillCardAdderWithItems : function(oStory, lPoolItems) {
    // sort the items
    this.orderPool(oStory, lPoolItems, function(lSortedItems){
      //place the sorted items in the card adder
      this._oCardAdder.fill(lSortedItems);
    });
  },

  /**
   * order the items of the pool by score relatively to the story
   * @param {Cotton.Model.Story} oStory:
   *    story that will serve the sorting by score of the pool items
   * @param {array of Cotton.Model.HistoryItems} lPoolItems:
   *    items from the pool, already filtered
   **/
  orderPool : function(oStory, lPoolItems, mCallback){
    var self = this;
    var lSortedPool = [];
    var iLength = lPoolItems.length;
    for (var i = 0; i < iLength; i++){
      var oHistoryItem = lPoolItems[i];
      oHistoryItem['scoreToStory'] = Cotton.Algo.Score.Object.historyItemToStory(
        oHistoryItem, oStory);
      lSortedPool.push(oHistoryItem);
    }
    // sort items by highest score
    lSortedPool.sort(function(a,b){
      return b['scoreToStory'] - a['scoreToStory'];
    });
    mCallback.call(self,lSortedPool);
  },

  /**
   * add a card at the top of the card deck
   * @param {Cotton.Model.historyItem} oHistoryItem:
   *    historyItem to create a card from
   **/
  prependCard : function(oHistoryItem) {
    var oCard = this._oCardFactory.get(oHistoryItem, this._oGlobalDispatcher);
    this._lCards.unshift(oCard);
    // use after and not prepend, because the first dom element is the card adder.
    this._oCardAdder.$().after(oCard.$());
    // set height of the card, needed for default cards with quotes, before appending the
    // featured image. See Cotton.UI.Story.Card.Default
    oCard.setHeight();
    this._oCardAdder.removePoolItem(oHistoryItem);
  },

  removeCard : function(iHistoryItemId) {
    var self = this;
    var iLength = this._lCards.length;
    // Array of remaining cards
    var lRemainingCards = [];
    for (var i = 0; i < iLength; i++) {
      if (this._lCards[i].id() === iHistoryItemId) {
        // the cards to delete
        var oCardToRemove = this._lCards[i];
        oCardToRemove.removeCard();
        setTimeout(function() {
          oCardToRemove.purge();
          oCardToRemove = null;
          if (self._lCards.length === 0) {
            self._oGlobalDispatcher.publish('home');
          }
        }, 600);
        var bDeleted = true;
      } else {
        lRemainingCards.push(this._lCards[i]);
        this._lCards[i] = null;
      }
    }
    this._lCards = null;
    this._lCards = lRemainingCards;
  },

  hide : function() {
    this._$card_deck.detach();
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
    this._oGlobalDispatcher.unsubscribe('remove_card', this);
    this._oGlobalDispatcher.unsubscribe('pool_items', this);
    this._oGlobalDispatcher.unsubscribe('append_new_card', this);
    this._oGlobalDispatcher = null;
    this.purgeCards();
    this._oCardFactory = null;
    this._oCardAdder.purge();
    this._oCardAdder = null;
    this._$card_deck.remove();
    this._$card_deck = null;
  }

});
