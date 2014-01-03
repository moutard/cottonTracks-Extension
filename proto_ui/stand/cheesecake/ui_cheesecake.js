"use strict";

/**
 * UICheesecake is responsible for displaying data from a Cotton.Model.Cheesecake
 */
Cotton.UI.Stand.Cheesecake.UICheesecake = Class.extend({

  /**
   * {Cotton.Model.Cheesecake}
   */
  _oCheesecake : null,

  /**
   * {Cotton.UI.Stand.Cheesecake.Dashboard}
   */
  _oDashboard : null,

  /**
   * {Cotton.UI.Stand.Cheesecake.Deck}
   */
  _oDeck : null,

  /**
   * {DOM} cheesecake
   */
  _$cheesecake : null,

  /**
   * {DOM} cheesecake container
   */
  _$cheesecake_container : null,

  init : function(oCheesecake, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oCheesecake = oCheesecake;

    // DOM object for the cheesecake container.
    this._$cheesecake = $('<div class="ct-cheesecake"></div>');

    this._$cheesecake_container = $('<div class="ct-cheesecake_container"></div>');

    this._oDashboard = new Cotton.UI.Stand.Cheesecake.Dashboard(this._oCheesecake, oGlobalDispatcher);
    this._oDeck = new Cotton.UI.Stand.Cheesecake.Deck(oGlobalDispatcher);

    this.setWidth(this._computeSlots($(window).width()));

    this._$cheesecake.append(
      this._$cheesecake_container.append(
        this._oDashboard.$(),
        this._oDeck.$()
      )
    );

    this._oGlobalDispatcher.subscribe('window_scroll', this, function(){
      self._oDashboard.pushBack();
      if (!self._bScrolling) {
        self._bScrolling = true;
        self._oScrollTimeout = setTimeout(function(){
          self._bScrolling = false;
          self._oDashboard.bringFront();
        }, 600);
      }
    });

    this._oGlobalDispatcher.subscribe('give_cheesecake_items', this, function(dArguments){
      this.addCards(dArguments['history_items'])
    });

    this._oGlobalDispatcher.subscribe('add_more_cards', this, function(){
      this._showSuggestions();
    });

    this._oGlobalDispatcher.subscribe('validate_stack', this, function(dArguments){
      var lHistoryItems = dArguments['history_items'];
      this.addCards(lHistoryItems);
      this.updateCheesecake(lHistoryItems);
      this._purgeCardAdder();
    });

    this._oGlobalDispatcher.subscribe('cancel_adder', this, function(){
      this._purgeCardAdder();
      if (this._oCheesecake.historyItemsId().length === 0){
        this._oGlobalDispatcher.publish('home');
      }
    });

    this._oGlobalDispatcher.subscribe('cheesecake_id', this, function(dArguments){
      if (!this._oCheesecake.id()) {
        this._oCheesecake.setId(dArguments['id']);
      }
    });

    this._oGlobalDispatcher.subscribe('delete_cheesecake_card', this, function(dArguments){
      var iHistoryItemId = dArguments['history_item_id'];
      this._oDeck.removeCardFromDeck(iHistoryItemId);
      this._oCheesecake.removeHistoryItem(iHistoryItemId);
      this._oGlobalDispatcher.publish('update_db_cheesecake', {
        'cheesecake': this._oCheesecake
      });
    });

    this._oGlobalDispatcher.subscribe('window_resize', this, function(dArguments){
      this.setWidth(this._computeSlots(dArguments['width']));
    });


    if (this._oCheesecake.historyItemsId().length > 0) {
      this._oGlobalDispatcher.publish('ask_cheesecake_items', {
        'history_items_id' : this._oCheesecake.historyItemsId()
      });
    } else {
      this._showSuggestions();
    }
  },

  $ : function() {
    return this._$cheesecake;
  },

  /**
   * draw the cards by the card deck
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data to display.
   */
  drawCards : function(oStory) {
    this._oDeck.drawCards(oStory);
  },

  addCards : function(lHistoryItems) {
    this._oDeck.addCards(lHistoryItems);
  },

  hideCards : function() {
    this._oDeck.hide();
  },

  showCards : function() {
    this._$cheesecake_container.append(this._oDeck.$());
  },

  _updateSuggestions : function() {
    this._oCheesecake.setHistoryItemsSuggest(this._oDashboard.getSuggestions());
  },

  _showSuggestions : function() {
    this._updateSuggestions();
    this._oCardAdder = new Cotton.UI.Stand.Cheesecake.CardAdder.UICardAdder(this._oCheesecake, this._oGlobalDispatcher);
    this._$cheesecake.append(this._oCardAdder.$());
  },

  updateCheesecake : function(lHistoryItems) {
    var iLength = lHistoryItems.length;
    if (!this._oCheesecake.featuredImage()) {
      // oCheesecake is passed by reference, so it is directly modified
      this.updateCheesecakeImage(lHistoryItems);
    }
    for (var i = 0; i < iLength; i++) {
      this._oCheesecake.removeHistoryItemSuggest(lHistoryItems[i]);
      this._oCheesecake.addHistoryItem(lHistoryItems[i]);
    }
    var oDate = new Date();
    this._oCheesecake.setLastVisitTime(oDate.getTime())
    this._oGlobalDispatcher.publish('update_db_cheesecake', {
      'cheesecake': this._oCheesecake
    });
  },

  updateCheesecakeImage : function(lHistoryItems) {
    var iLength = lHistoryItems.length
    for (var i = 0; i < iLength; i++) {
      if (lHistoryItems[i].extractedDNA().imageUrl()) {
        this._oCheesecake.setFeaturedImage(lHistoryItems[i].extractedDNA().imageUrl());
        this._oDashboard.updateStickerImage(this._oCheesecake.featuredImage());
        return;
      }
    }
  },

  _computeSlots : function(iWindowWidth) {
    var CARD_WIDTH = 425;
    var CARD_MARGIN = 20;
    var DASHBOARD_WIDTH = 280;
    var iSlotsPerLine = Math.floor((iWindowWidth - DASHBOARD_WIDTH)/(CARD_WIDTH + 2 * CARD_MARGIN));
    return iSlotsPerLine;
  },

  setWidth : function(iSlotsPerLine) {
    var CARD_WIDTH = 425;
    var CARD_MARGIN = 20;
    var DASHBOARD_WIDTH = 280;
    this._$cheesecake_container.width(DASHBOARD_WIDTH + iSlotsPerLine * (CARD_WIDTH + 2 * CARD_MARGIN));
  },

  _purgeCardAdder : function() {
    if (this._oCardAdder) {
      this._oCardAdder.purge();
      this._oCardAdder = null;
    }
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('window_scroll', this);
    this._oGlobalDispatcher.unsubscribe('add_more_cards', this);
    this._oGlobalDispatcher.unsubscribe('give_cheesecake_items', this);
    this._oGlobalDispatcher.unsubscribe('validate_stack', this);
    this._oGlobalDispatcher.unsubscribe('cancel_adder', this);
    this._oGlobalDispatcher.unsubscribe('cheesecake_id', this);
    this._oGlobalDispatcher.unsubscribe('delete_cheesecake_card', this);
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
    this._oGlobalDispatcher = null;

    // Clear the timeout, otherwise we could try asyncronously to access the _oDashboard
    // that has already been purged. ex: swipe right to go to previous page.
    clearTimeout(this._oScrollTimeout);
    this._oScrollTimeout = null;
    this._bScrolling = null;

    this._purgeCardAdder();

    this._oDeck.purge();
    this._oDeck = null;
    this._oDashboard.purge();
    this._oDashboard = null;

    this._oCheesecake = null;

    this._$cheesecake_container.remove();
    this._$cheesecake_container = null;
    this._$cheesecake.remove();
    this._$cheesecake = null;
  }

});