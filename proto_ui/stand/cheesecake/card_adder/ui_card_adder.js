'use strict';

Cotton.UI.Stand.Cheesecake.CardAdder.UICardAdder = Class.extend({

  init : function(oCheesecake, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lStack = [];

    this._$card_adder = $('<div class="ct-card_adder"></div>');
    this._$card_adder_box = $('<div class="ct-card_adder_box"></div>');
    this._oAdderHead = new Cotton.UI.Stand.Cheesecake.CardAdder.AdderHead(oGlobalDispatcher);
    this._oAdderDeck = new Cotton.UI.Stand.Cheesecake.Deck(oGlobalDispatcher);

    this._$card_adder.click(function(e){
      if (e.target === this) {
        self._oGlobalDispatcher.publish('cancel_adder');
      }
    });

    this._$card_adder.append(
      this._$card_adder_box.append(
        this._oAdderHead.$(),
        this._oAdderDeck.$()
      )
    );
    this._oAdderDeck.addSuggestCards(oCheesecake.historyItemsSuggest());

    this._oGlobalDispatcher.subscribe('add_suggestion_to_stack', this, function(dArguments){
      this.addRemoveFromStack(dArguments['history_item']);
    });

    this._oGlobalDispatcher.subscribe('validate_adder_and_close', this, function(){
      this.validateStack();
    });


    this._oGlobalDispatcher.subscribe('refresh_suggestions', this, function(dArguments){
      this.refreshSuggestions(dArguments['history_items_suggestions'], oCheesecake);
    });

  },

  $ : function() {
    return this._$card_adder;
  },

  addRemoveFromStack : function(oHistoryItem) {
    var iHistoryItemId = oHistoryItem.id();
    var iLength = this._lStack.length;
    for (var i = 0; i < iLength; i++) {
      if (this._lStack[i].id() === iHistoryItemId) {
        return this.removeFromStack(iHistoryItemId);
      }
    }
    // if we arrive here, it means that the item was not in the stack
    this.addToStack(oHistoryItem);
  },

  addToStack : function(oHistoryItem) {
    this._lStack.push(oHistoryItem);
  },

  removeFromStack : function(iHistoryItemId) {
    var iLength = this._lStack.length;
    var lTempItems = [];
    for (var i = 0; i < iLength; i++) {
      if (this._lStack[i].id() !== iHistoryItemId) {
        lTempItems.push(this._lStack[i]);
      }
    }
    this._lStack = lTempItems;
  },

  validateStack : function() {
    Cotton.ANALYTICS.validateCards(this._lStack.length);
    this._oGlobalDispatcher.publish('validate_stack', {
      "history_items": this._lStack
    });
  },

  refreshSuggestions : function(lHistoryItems, oCheesecake) {
    var lRemainingItems = [];
    var iLength = lHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      if (oCheesecake.historyItemsId().indexOf(lHistoryItems[i].id()) === -1) {
        lRemainingItems.push(lHistoryItems[i]);
      }
    }
    this._oAdderDeck.purgeCards();
    this._oAdderDeck.$().empty();
    this._oAdderDeck.addSuggestCards(lRemainingItems)
  },

  _purgeStack : function() {
    var iLength = this._lStack.length;
    for (var i = 0; i < iLength; i++) {
      this._lStack[i] = null;
    }
    this._lStack = null;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('add_suggestion_to_stack', this);
    this._oGlobalDispatcher.unsubscribe('validate_adder_and_close', this);
    this._oGlobalDispatcher.unsubscribe('refresh_suggestions', this);
    this._oGlobalDispatcher = null;
    this._purgeStack();
    this._oAdderDeck.purge();
    this._oAdderDeck = null;
    this._oAdderHead.purge();
    this._oAdderHead = null;
    this._$card_adder_box.remove();
    this._$card_adder_box = null;
    this._$card_adder.remove();
    this._$card_adder = null;
  }

});