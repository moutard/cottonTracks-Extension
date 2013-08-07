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
   * @param {array} lStories
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(lStories, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    // DOM object for the manager.
    this._$manager = $('<div class="ct-manager"></div>');

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
