"use strict";

/**
 * Class reponsible for appending the covers in the main Manager, in separate
 * containers defined by a timestamp
 */
Cotton.UI.Stand.Manager.UIManager = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * manager DOM element, contains the stickers of the stories,
   * in reverse chronological order, separated by time landmarks
   */
  _$manager : null,

  /**
   * Array<Cotton.UI.Stand.Manager.Shelf> _lShelves: list of shelves,
   * that contains time stamp and corresponding cover.
   */
  _lShelves : null,

  /**
   * Millisecond epoch for tomorow date that we use as threshold for timestamp.
   */
  _fTomorrow : null,

  /**
   * @param {array} lStories
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(lStories, oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;
    // DOM object for the manager.
    this._$manager = $('<div class="ct-manager"></div>');
    this._lShelves = [];

    // Set today's date as a reference for timestamps.
    var oNow = new Date();
    var oToday = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 0, 0, 0, 0);

    // Time for one day in milliseconds.
    var ONE_DAY = 86400000;

    // We take tomorrow midnight as a reference because "today" is defined as
    // "everything before tomorrow"
    this._fTomorrow = oToday.getTime() + ONE_DAY;
    this.createShelves(lStories);

  },

  $ : function() {
    return this._$manager;
  },

  purge : function() {
    this._oGlobalDispatcher = null;

    this._$manager.remove();
    this._$manager = null;
  },

  /**
   * Group story by date and for each group create a shelf.
   */
  createShelves : function(lStories) {
    if (lStories.length > 0) {
      var oShelf = new Cotton.UI.Manager.Shelf(this._fTomorrow,
        fLastTimeStamp, sScale, lStories);
      this._lShelves.push(oShelf);
      this._$manager.append(oShelf.$());
    }
  }

});
