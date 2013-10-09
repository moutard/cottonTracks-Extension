"use strict";

/**
 * Search contains the input field and the button.
 */
Cotton.UI.Topbar.Search = Class.extend({

  /**
   * {DOM} current element
   */
  _$search: null,

  /**
   * {DOM} field input of the search
   */
  _$search_field : null,

  /**
   * {DOM} button to validate the search
   */
  _$search_button : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$search = $('<div class="ct-search"></div>');
    this._$search_field = $('<input class="ct-search_field" placeholder=" Search your online memory"/>');
    this._$search_button = $('<div class="ct-search_button">Search</div>');
    this._$search.append(this._$search_field, this._$search_button);

    this._oGlobalDispatcher.subscribe('focus_search', this, function(){
      this._$search_field.focus();
    });

    this._$search_field.keypress(function(oEvent){
      if (oEvent.which === 13) {
        // 13 = enter key.
        if ($(this).val()) {
          self._search();
          // analytics tracking.
          Cotton.ANALYTICS.searchStories('enter');
        }
      }
    });
    this._$search_button.click(function(){
      if (self._$search_field.val()) {
        self._search();
        // analytics tracking.
        Cotton.ANALYTICS.searchStories('search_button');
      }
    });
  },

  _search : function() {
    var sQuery = this._$search_field.val().toLowerCase();
    var lSearchWords = (sQuery.length > 0) ? sQuery.split(' ') : [];
    this._oGlobalDispatcher.publish('search_stories', {
      'search_words': lSearchWords,
    });
  },

  $ : function() {
    return this._$search;
  }

});
