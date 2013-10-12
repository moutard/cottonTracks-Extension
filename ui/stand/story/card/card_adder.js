"use strict";
/**
 * Class responsible for listing all the pool items possible to add to a story
 **/
Cotton.UI.Stand.Story.Card.CardAdder = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {int} id of the current story
   **/
  _iStoryId: null,

  /**
   * {bool} state of the card adder, expanded or collapsed
   **/
  _bExpanded: null,

  /**
   * {DOM} card adder dom element, containing the toolbar, and the list of elements
   */
  _$card_adder : null,

  /**
   * {DOM} card adder toolbar, with "add card" button, and search to come
   */
  _$toolbar : null,

  /**
   * {DOM} "add card" button
   */
  _$add_new_card : null,

  /**
   * {DOM} pool items dom list
   */
  _$list : null,

  /**
   * {list of Cotton.UI.Stand.Story.Card.Content.PoolItems} pool item objects
   */
  _lPoolItems : null,

  init : function(iStoryId, oGlobalDispatcher) {
    var self = this;
    this._iStoryId = iStoryId;
    this._bExpanded = false;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._lPoolItems = [];
    this._$card_adder = $('<div class="ct-card ct-card_adder"></div>');
    this._$toolbar = $('<div class="ct-card_adder_toolbar"></div>').click(function(){
      if (!self._bExpanded) {
        self._oGlobalDispatcher.publish('expand_card_adder');
        self.expand();
      } else {
        self.collapse();
      }
    });
    this._$add_new_card = $('<div class="ct-add_new_card">Add a new card</div>');
    this._$list = $('<div class="ct-cards_adder_list"></div>');

    this._$card_adder.append(this._$toolbar.append(this._$add_new_card));
  },

  $ : function() {
    return this._$card_adder;
  },

  expand : function() {
    this._bExpanded = true;
    this._$card_adder.append(this._$list);
  },

  collapse : function() {
    this._bExpanded = false;
    // purge the list of item to release memory
    var iLength = this._lPoolItems.length;
    for (var i = 0; i < iLength; i++) {
      this._lPoolItems[i].purge();
      this._lPoolItems[i] = null;
    }
    this._lPoolItems = [];
    this._$list.empty().remove();
  },

  fill : function(lPoolHistoryItems) {
    // analytics tracking
    Cotton.ANALYTICS.fetchPool();

    var iLength = lPoolHistoryItems.length;
    if (iLength === 0) {
      var $no_item = $('<div class="ct-no_pool_item">No new card to add, you will find here the pages that have not been placed in a story yet.</br>Just click on them to add them to the current story.</div>');
      this._$list.append($no_item);
    }
    // create the pool item objects, and append the dom objects to the list
    // we store the objects to be able to purge them later
    for (var i = 0; i < iLength; i++) {
      var oPoolHistoryItem = lPoolHistoryItems[i];
      var oPoolItemToAdd = new Cotton.UI.Stand.Story.Card.Content.PoolItem(oPoolHistoryItem, this._iStoryId, this._oGlobalDispatcher);
      this._lPoolItems.push(oPoolItemToAdd);
      var $pool_item = oPoolItemToAdd.$();
      this._$list.append($pool_item);
    }
  },

  removePoolItem : function(oHistoryItem) {
    var iId = oHistoryItem.id();
    var iLength = this._lPoolItems.length;
    var lRemainingPoolItems = [];
    for (var i = 0; i < iLength; i++) {
      if (this._lPoolItems[i].id() === iId) {
        this._lPoolItems[i].purge();
        this._lPoolItems[i] = null;
      } else {
        lRemainingPoolItems.push(this._lPoolItems[i]);
        this._lPoolItems[i] = null;
      }
    }
    this._lPoolItems = null;
    this._lPoolItems = lRemainingPoolItems;
    if (this._lPoolItems.length === 0) {
      var $no_item = $('<div class="ct-no_pool_item">No more card to add.</div>');
      this._$list.append($no_item);
    }
  },

  purge : function() {
    var iLength = this._lPoolItems.length;
    for (var i = 0; i < iLength; i++) {
      this._lPoolItems[i].purge();
      this._lPoolItems[i] = null;
    }
    this._lPoolItems = null;

    this._$list.empty().remove();
    this._$list = null;
    this._$add_new_card.unbind('click').remove();
    this._$add_new_card = null;
    this._$toolbar.remove();
    this._$toolbar = null;
    this._$card_adder.remove();
    this._$card_adder = null;
    this._oGlobalDispatcher = null;
  }
});