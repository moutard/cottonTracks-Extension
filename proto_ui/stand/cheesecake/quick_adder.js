"use strict";

Cotton.UI.Stand.Cheesecake.QuickAdder = Class.extend({

  init : function(oCheesecake, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oCheesecake = oCheesecake;

    this._$quick_adder = $('<div class="ct-quick_adder"></div>');
    this._$hint = $('<div class="ct-quick_adder_hint">add a new card</div>');

    this._$add_skip = $('<div class="ct-quick_adder_add_skip"></div>');
    this._$add_button = $('<div class="ct-quick_adder_add_button">Add</div>');
    this._$skip_button = $('<div class="ct-quick_adder_skip_button">Skip</div>');

    this._$add_button.click(function(){
      Cotton.ANALYTICS.addQuickAdd();
      self._oGlobalDispatcher.publish('validate_stack', {
        'history_items' : [self._lSuggestions[0]]
      });
    });

    this._$skip_button.click(function(){
      Cotton.ANALYTICS.skipQuickAdd();
      self._skip();
    });

    this._$add_more = $('<div class="ct-add_more">add more</div>');
    this._$add_more.click(function(){
      oGlobalDispatcher.publish('add_more_cards');
    });

    this._$top_suggestion = $('<div class="ct-top_suggestion"></div>');
    this._$top_suggestion.click(function(){
      self._oGlobalDispatcher.publish('validate_stack', {
        'history_items' : [self._lSuggestions[0]]
      });
    });

    this._lSuggestions = this._oCheesecake.historyItemsSuggest();
    this._oTopSuggestion = this._lSuggestions[0];
    if (!this._oTopSuggestion) {
      this._oGlobalDispatcher.publish('ask_items_suggestions', {
        'title': this._oCheesecake.title()
      });
    } else {
      this.updateSuggest();
    }

    this._oGlobalDispatcher.subscribe('give_items_suggestions', this, function(dArguments){
      this._oCheesecake.setHistoryItemsSuggest(dArguments['history_items_suggestions']);
      this._lSuggestions = this._oCheesecake.historyItemsSuggest();
      this._oGlobalDispatcher.publish('refresh_suggestions', {'history_items_suggestions' : this._lSuggestions});
      this.updateSuggest();
    });

    this._oGlobalDispatcher.subscribe('validate_stack', this, function(dArguments){
      var lItemsAdded = dArguments["history_items"];
      this.removeSuggestions(lItemsAdded);
    });

    this._oGlobalDispatcher.subscribe('cheesecake_id', this, function(dArguments){
      if (!this._oCheesecake.id()) {
        this._oCheesecake.setId(dArguments['id']);
      }
    });

    this._$quick_adder.append(
      this._$hint,
      this._$top_suggestion,
      this._$add_skip.append(
        this._$skip_button,
        this._$add_button
      ),
      this._$add_more
    );
  },

  $ : function() {
    return this._$quick_adder;
  },

  updateSuggest : function() {
    if (this._lSuggestions.length > 0) {
      var sTitle = (this._lSuggestions[0].title() !== "") ? this._lSuggestions[0].title() : this._lSuggestions[0].url();
      this._$top_suggestion.text(sTitle);
    } else {
      this._$top_suggestion.text('no more suggestion');
      this._$top_suggestion.unbind('click');
      this._$add_button.unbind('click').remove();
      this._$skip_button.unbind('click').remove();
      this._$add_skip.remove();
    }
  },

  _skip : function() {
    this._oCheesecake.addHistoryItemExcludeId(this._lSuggestions[0].id());
    this._oGlobalDispatcher.publish('update_db_cheesecake', {
      'cheesecake': this._oCheesecake
    });
    this._next();
  },

  _next : function() {
    var lNewSuggestion = [];
    var iLength = this._lSuggestions.length;
    for (var i = 1; i < iLength; i++) {
      lNewSuggestion.push(this._lSuggestions[i]);
    }
    this._lSuggestions = lNewSuggestion;
    this.updateSuggest();
  },

  removeSuggestions : function(lHistoryItemsToRemove) {
    var lIdsToRemove = [];
    var lNewSuggestion = [];
    var iLength = lHistoryItemsToRemove.length;
    for (var i = 0; i < iLength; i++) {
      lIdsToRemove.push(lHistoryItemsToRemove[i].id());
    }

    iLength = this._lSuggestions.length;
    for (var i = 0; i < iLength; i++) {
      if (lIdsToRemove.indexOf(this._lSuggestions[i].id()) === -1) {
        lNewSuggestion.push(this._lSuggestions[i]);
      }
    }
    this._lSuggestions = lNewSuggestion;
    this.updateSuggest();
  },

  getSuggestions : function() {
    return this._lSuggestions;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('give_items_suggestions', this);
    this._oGlobalDispatcher.unsubscribe('validate_stack', this);
    this._oGlobalDispatcher.unsubscribe('cheesecake_id', this);
    this._oCheesecake = null;
    this._$quick_adder.remove();
    this._$quick_adder = null;
  }

});