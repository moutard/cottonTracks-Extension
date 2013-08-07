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

    // Set today's date as a reference for timestamps.
    var oNow = new Date();
    var oToday = new Date (oNow.getFullYear(), oNow.getMonth(), oNow.getDate(), 0, 0, 0, 0);
    oNow = null;

    // Time for one day in milliseconds.
    var iOneDay = 86400000;

    // We take tomorrow midnight as a reference because "today" is defined as
    // "everything before tomorrow"
    this._fTomorrow = oToday.getTime() + iOneDay;
    oToday = null;

  },

  $ : function() {
    return this._$manager;
  },

  purge : function() {
    this._oGlobalDispatcher = null;

    this._$manager.remove();
    this._$manager = null;
  }

});
