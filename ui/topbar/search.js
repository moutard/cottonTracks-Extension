"use strict";

/**
 * Search contains the input field and the button.
 */
Cotton.UI.Topbar.Search = Class.extend({

  /**
   * {Cotton.Controller.Dispatcher} globalDispatcher.
   */
  _oGlobalDispatcher: null,

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
    this._$search_button = $('<div class="ct-search_button"><div class="ct-search_button_icon"></div>Search</div>');
    this._$search.append(this._$search_field, this._$search_button);

    this._oGlobalDispatcher.subscribe('focus_search', this, function(){
      this._$search_field.focus();
    });
    // To open the field as soon as the source is updated.
    this._$search_field.autocomplete({
        source: []
    });

    this._oGlobalDispatcher.subscribe('autocomplete_answer', this, function(dParameters){
      this._$search_field.autocomplete({
        autofocus: false,
        delay: 100,
        minLength: 0,
        select: function(event, ui) {
          // The query is the all the text concatenated with the whole word
          // from the complete suggestion.
          var sInput = $(this).val(); // Value of the input.
          var iSpaceIndex = sInput.lastIndexOf(" ");
          var sQuery = ui.item.value;
          if (iSpaceIndex !== -1) {
            var sQuery = sInput.slice(0, sInput.lastIndexOf(" ")) + " " + ui.item.value;
          }
          this.value = sQuery;
          self._search(sQuery);
          return false;
        },
        focus : function(event, ui) {
          // Overide the default focus method, that modify the input field value.
          return false;
        },
        source : function(request, response) {
          // Delegate back to autocomplete, but extract the last term.
          response (dParameters['possible_keywords'], request.term);
        },
      });
    });


    this._$search_field.keypress(function(oEvent){
      if (oEvent.which === 13) {
        // 13 = enter key.
        if ($(this).val()) {
          self._search($(this).val());
          // Close the autocomplete suggestion when click on enter.
          $(this).autocomplete('close');
          // Analytics tracking.
          Cotton.ANALYTICS.searchStories('enter');
        }
      }
    });
    this._$search_field.keyup(function(oEvent){
      if (oEvent.which !== 13) {
        // Compute autocomplete each time you press a key.
        self._autocomplete($(this).val());
      }
    });
    this._$search_button.click(function(){
      if (self._$search_field.val()) {
        self._search(self._$search_field.val());
        // analytics tracking.
        Cotton.ANALYTICS.searchStories('search_button');
      }
    });

  },

  /**
   * - Publish the search_stories event.
   * - Publish update the popstater event.
   *
   *   The search is sent raw.
   *   @param {String} sQuery:
   *                    the raw query.
   */
  _search : function(sQuery) {
    var sLowerQuery = sQuery.toLowerCase();
    // FIXME(rmoutard): break MVC should be in the controller.
    var lSearchWords = (sLowerQuery.length > 0) ? sLowerQuery.split(' ') : [];
    this._oGlobalDispatcher.publish('push_state', {
      'code': '?q=',
      'value': lSearchWords.join('+')
    });
    this._oGlobalDispatcher.publish('search_stories', {
      'search_words': sLowerQuery
    });
  },

  /**
   * - Publish the autocomplete_ask event.
   *   This event ask for the list of words that can match the prefix of the
   *   query.
   *
   *   @param {String} sQuery:
   *                  the raw query.
   */
  _autocomplete : function(sQuery) {
    var sPrefix = "";
    var sQuery = sQuery.toLowerCase();
    // Only autocomplete the last words.
    var lSearchWords = (sQuery.length > 0) ? sQuery.split(' ') : [];
    sPrefix = lSearchWords[lSearchWords.length - 1];
    if (lSearchWords.length >= 1 && sPrefix.length > 0) {
      this._oGlobalDispatcher.publish('autocomplete_ask', {
        'prefix': sPrefix
      });
    }
  },

  $ : function() {
    return this._$search;
  }

});
