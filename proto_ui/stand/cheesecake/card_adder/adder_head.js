"use strict";

Cotton.UI.Stand.Cheesecake.CardAdder.AdderHead = Class.extend({

  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$card_adder_head = $('<div class="ct-card_adder_head"></div>');
    this._oAdderSearch = new Cotton.UI.Stand.Cheesecake.CardAdder.AdderSearch(oGlobalDispatcher);
    this._$card_adder_selectors = $('<div class="ct-card_adder_selectors"></div>');
    this._$card_adder_validate = $('<div class="ct-card_adder_validate">add selected cards</div>');
    this._$card_adder_select_all = $('<div class="card_adder_select_option">select all</div>');
    this._$card_adder_clear_all = $('<div class="card_adder_select_option">clear all</div>');
    this._$card_adder_cancel = $('<div class="card_adder_select_option">cancel</div>');

    this._$card_adder_select_all.click(function(){
      Cotton.ANALYTICS.selectAllToAdd();
      self.selectAll();
    });

    this._$card_adder_clear_all.click(function(){
      Cotton.ANALYTICS.removeAllToAdd();
      self.clearAll();
    });

    this._$card_adder_cancel.click(function(){
      self.cancel();
    });

    this._$card_adder_validate.click(function(){
      self.validateAndClose();
    });

    this._oGlobalDispatcher.subscribe('escape', this, function(){
      self.cancel();
    });

    this._$card_adder_head.append(
      this._oAdderSearch.$(),
      this._$card_adder_selectors.append(
        this._$card_adder_validate,
        this._$card_adder_select_all,
        this._$card_adder_clear_all,
        this._$card_adder_cancel
      )
    );
  },

  $ : function() {
    return this._$card_adder_head;
  },

  validateAndClose : function() {
    this._oGlobalDispatcher.publish('validate_adder_and_close');
  },

  selectAll : function() {
    this._oGlobalDispatcher.publish('select_all_suggestions');
  },

  clearAll : function() {
    this._oGlobalDispatcher.publish('clear_all_suggestions');
  },

  cancel : function() {
    this._oGlobalDispatcher.publish('cancel_adder');
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('escape', this);
    this._oGlobalDispatcher = null;
    this._$card_adder_validate.remove();
    this._$card_adder_validate = null;
    this._$card_adder_head.remove();
    this._$card_adder_head = null;
  }
});