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
    this._$search = $('<div class="ct-search"></div>');
    this._$search_field = $('<input class="ct-search_field" placeholder=" Search your online memory"/>');
    this._$search_button = $('<div class="ct-search_button">Search</div>');
    this._$search.append(this._$search_field, this._$search_button);


    oGlobalDispatcher.subscribe('focus_search', this, function(){
      this._$search_field.focus();
    });
  },

  $ : function() {
    return this._$search;
  }

});
