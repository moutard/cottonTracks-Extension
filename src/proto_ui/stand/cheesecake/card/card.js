"use strict";

/**
 * Generic class for a card, will be extended to Card.Default, Card.Image, Card.Video
 * Card.Map, ...
 * contains a card with a media part (left), and details (right) with title and url
 * also the website domain and favicon
 **/
Cotton.UI.Stand.Cheesecake.Card.Card = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * Local Dispatcher just for a card
   */
  _oLocalDispatcher : null,

  /**
   * {DOM} card frame
   */
  _$card : null,

  /**
   * {DOM} media container, left part of the card
   */
  _$media : null,

  /**
   * {DOM} details container (title, quotes,...), right part of the card
   */
  _$details : null,

  /**
   * {Cotton.UI.Stand.Cheesecake.Card.Content.Title} title object for the card
   */
  _oTitle : null,

  /**
   * {DOM} delete cross
   */
  _$delete : null,

  /**
   * {DOM} full url, on bottom right end corner
   */
  _$url : null,

  /**
   * {Cotton.UI.Stand.Cheesecake.Card.Content.Website} website object for the card,
   * with favicon and domain
   */
  _oWebsite : null,

  /**
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDisPatcher
   */
  init : function(oHistoryItem, oGlobalDispatcher) {
    var self = this;

    this._oHistoryItem = oHistoryItem;
    this._iId = oHistoryItem.id();

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oLocalDispatcher = new Cotton.Messaging.Dispatcher();
    this._$overlay = $('<a class="ct-card_overlay" href="'
      + oHistoryItem.url()
      + '" target="_blank"></a>').click(function(){
        Cotton.ANALYTICS.openInNewTab('card_deck');
      });

    this._$card = $('<div class="ct-card"></div>');
    this._$delete = $('<div class="ct-delete_card">+</div>').click(function(){
      // analytics tracking
      oGlobalDispatcher.publish('delete_cheesecake_card', {
        'history_item_id': oHistoryItem.id(),
      });
    });

    if (DEBUG) {
      var iColor = Math.max(15 - 2 * oHistoryItem.target, 0) ;
      iColor = (iColor === 15) ? "F" : (iColor === 13) ? "D" : (iColor === 11) ? "B" : iColor;
      var sColor = "#" + iColor + iColor + iColor;
      this._$card.css('background-color', sColor);
    }

    this._oGlobalDispatcher.subscribe('select_all_suggestions', this, function(){
      if (this._bSuggestionCard && !self._$selection_feedback.hasClass('ct-suggest_selected')) {
        this._$overlay.click();
      }
    });

    this._oGlobalDispatcher.subscribe('clear_all_suggestions', this, function(){
      if (this._bSuggestionCard && self._$selection_feedback.hasClass('ct-suggest_selected')) {
        this._$overlay.click();
      }
    });
  },

  $ : function() {
    return this._$card;
  },

  setType : function(sType) {
    this._$card.addClass('ct-' + sType + '_card');
    this._sType = sType;
  },

  /**
   * we use drawCard and not the init function because we need the media to be set
   * before the rest for css reasons (for $details to know what size to take)
   **/
  drawCard : function(){
    this._$card.append(
      this._$media,
      this._$overlay,
      this._$delete
    );
  },

  initHeight : function() {
    // do nothing for cards that are not default_cards
  },

  id : function() {
    return this._iId;
  },

  removeCard : function() {
    this._$card.addClass('ct-collapsed');
  },

  suggest : function() {
    var self = this;
    this._bSuggestionCard = true;
    // Remove delete for the moment
    this._$delete.unbind('click');
    this._$delete.remove();
    this._$delete = null;

    this._$overlay.remove();
    this._$overlay = $('<div class="ct-card_overlay"></div>').click(function(e){
      if (e.target === this || e.target === self._$selection_feedback[0]) {
        self._oGlobalDispatcher.publish('add_suggestion_to_stack', {
          "history_item" : self._oHistoryItem
        });
        self._$selection_feedback.toggleClass('ct-suggest_selected');
        if (self._$selection_feedback.hasClass('ct-suggest_selected')) {
          self._$selection_feedback.text('this card will be added');
        } else {
          self._$selection_feedback.text('Click to add to your cheesecake');
        }
      }
    });
    this._$selection_feedback = $('<div class="ct-suggestion_selection_feedback">Click to add to your deck</div>');
    this._$open = $('<a class="ct-open_suggestion" href="'
      + this._oHistoryItem.url()
      + '" target="_blank">open in new tab</a>').click(function(){
        Cotton.ANALYTICS.openInNewTab('card_adder');
      });

    this._$card.append(
      this._$overlay.append(
        this._$open,
        this._$selection_feedback
      )
    );
  },

  purge : function() {
    this._iId = null;
    this._sType = null;
    this._bSuggestion = null;
    this._oGlobalDispatcher.unsubscribe('select_all_suggestions', this);
    this._oGlobalDispatcher.unsubscribe('clear_all_suggestions', this);
    this._oGlobalDispatcher = null;
    this._oLocalDispatcher = null;
    if (this._$media) {
      this._$media.remove();
      this._$media = null;
    }
    if (this._$delete) {
      this._$delete.unbind('click');
      this._$delete.remove();
      this._$delete = null;
    }
    if (this._$selection_feedback) {
      this._$selection_feedback.remove();
      this._$selection_feedback = null;
      this._$open.remove();
      this._$open = null;
    }
    this._$overlay.remove();
    this._$overlay = null;
    this._$card.remove();
    this._$card = null;
  }

});
