'use strict';

Cotton.UI.Stand.Cheesecake.CardAdder.UICardAdder = Class.extend({

  init : function(oCheesecake, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._lStack = [];

    this._$card_adder = $('<div class="ct-card_adder"></div>');
    this._$card_adder_box = $('<div class="ct-card_adder_box"></div>');
    this._oAdderHead = new Cotton.UI.Stand.Cheesecake.CardAdder.AdderHead(oGlobalDispatcher);
    this._oAdderDeck = new Cotton.UI.Stand.Cheesecake.Deck(oCheesecake, oGlobalDispatcher);

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
    this._oGlobalDispatcher.publish('validate_stack', {
      "history_items": this._lStack
    });
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