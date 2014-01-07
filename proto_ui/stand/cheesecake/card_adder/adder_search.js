"use strict"

Cotton.UI.Stand.Cheesecake.CardAdder.AdderSearch = Class.extend({

  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$card_adder_search = $('<div class="ct-card_adder_search"></div>');
    this._$title = $('<div class="ct-card_adder_search_title">Choose cards to add</div>');
    this._$subtitle = $('<div class="ct-card_adder_search_subtitle">Select from suggested pages or search for more</div>');
    this._$input_box = $('<div class="ct-card_adder_search_input_box"></div>');
    this._$input = $('<input class="ct-card_adder_search_input"/>');

    this._$input.keypress(function(oEvent){
      if (oEvent.which === 13) {
        // 13 = enter key.
        self.search();
      }
    });

    this._$card_adder_search.append(
      this._$title,
      this._$subtitle,
      this._$input_box.append(
        this._$input
      )
    );
  },

  $ : function() {
    return this._$card_adder_search;
  },

  search : function() {
    if (this._$input.val() !== "") {
      Cotton.ANALYTICS.searchMoreCards();
      this._oGlobalDispatcher.publish('search_suggestions', {
        'search_query' : this._$input.val()
      });
    }
  },

  purge : function() {
    this._$card_adder_search = null;
  }

});