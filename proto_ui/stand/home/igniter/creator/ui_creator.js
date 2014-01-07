"use strict";

/**
 * creator contains the input field and the button.
 * to start a cheesecake
 */
Cotton.UI.Stand.Home.Igniter.Creator.UICreator = Class.extend({

  /**
   * {DOM} current element
   */
  _$creator: null,

  /**
   * {DOM} input field of the creator
   */
  _$creator_input : null,

  /**
   * {DOM} button to validate the search
   */
  _$creator_button : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._iRequests = 0;
    var TYPING_TIMEOUT = 600;

    this._$creator = $('<div class="ct-creator"></div>');
    this._$creator_explainer_title = $('<div class="ct-creator_explainer_title">'
      + 'Create a new Deck'
      + '</div>');
    this._$creator_explainer_text = $('<div class="ct-creator_explainer_text">'
      + 'What are you looking for? Tell us what subject you are '
      + '</br>into and we will bring you every page on this subject'
      + '</div>');
    this._$creator_input = $('<input class="ct-creator_input"/>');
    this._$creator_button = $('<div class="ct-creator_button">Start by typing a title</div>');
    this._$creator.append(
      this._$creator_explainer_title,
      this._$creator_explainer_text,
      this._$creator_input,
      this._$creator_button
    );
    this._oGlobalDispatcher.subscribe('focus_creator', this, function(){
      this._$creator_input.focus();
    });

    this._oGlobalDispatcher.subscribe('new_cheesecake', this, function(dArguments){
      this._iRequests--;
      var oCheesecake = dArguments['cheesecake'];
      if (oCheesecake.historyItemsSuggest().length > 0) {
        this._$creator_button.text("Create with " + oCheesecake.historyItemsSuggest().length + " cards");
        this._$creator_button.addClass('ct-active');
      } else {
        this._$creator_button.removeClass('ct-active');
        if (this._$creator_input.val()){
          this._$creator_button.text("Create empty deck");
        } else {
          this._$creator_button.text("Start by typing a title");
        }
      }
      this._createCheesecake(oCheesecake);
    });

    this._$creator_input.keyup(function(oEvent){
      if (oEvent.which !== 13) {
        // (ban 13 == enter key)
        if ($(this).val()) {
          clearTimeout(self._oTimeout);
          self._oTimeout = setTimeout(function(){
            self._fetchRecipe();
          }, TYPING_TIMEOUT);
        }
      }
    });

    this._$creator_input.keypress(function(oEvent){
      if (oEvent.which === 13) {
        self._sValidationMedium = "creator_box_enter";
        // 13 = enter key.
        clearTimeout(self._oTimeout);
        self._bReadyForCheesecake = true;
        self._fetchRecipe();
      }
    });

    this._$creator_button.click(function(oEvent){
      if (self._$creator_input.val()) {
        self._sValidationMedium = "creator_box_button";
        clearTimeout(self._oTimeout);
        self._bReadyForCheesecake = true;
        self._fetchRecipe();
      }
    });
  },

  _fetchRecipe : function() {
    this._iRequests++;
    var sQuery = this._$creator_input.val().toLowerCase();
    var lSearchWords = (sQuery.length > 0) ? sQuery.split(/\ |\-|\'/) : [];

    this._oGlobalDispatcher.publish('fetch_recipe', {
      'search_words': lSearchWords
    });
  },

  _createCheesecake : function(oCheesecake) {
    if (this._iRequests === 0 && this._bReadyForCheesecake
    && this._$creator_input.val()) {
      Cotton.ANALYTICS.createDeck(this._sValidationMedium);
      oCheesecake.setTitle(this._$creator_input.val().toLowerCase());
      this._oGlobalDispatcher.publish('open_cheesecake', {'cheesecake': oCheesecake});
    } else {
     this._bReadyForCheesecake = false;
    }
  },

  $ : function() {
    return this._$creator;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('focus_creator', this);
    this._oGlobalDispatcher.unsubscribe('new_cheesecake', this);
    this._oGlobalDispatcher = null;
    this._iRequest = null;
    this._bReadyForCheesecake = null;
    this._$creator_button.remove();
    this._$creator_button = null;
    this._$creator_input.remove();
    this._$creator_input = null;
    this._$creator_explainer_text.remove();
    this._$creator_explainer_text = null;
    this._$creator_explainer_title.remove();
    this._$creator_explainer_title = null;
  }

});