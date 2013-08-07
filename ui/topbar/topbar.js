"use strict";

Cotton.UI.Topbar.UITopbar = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * topbar DOM element, contains the menu with logo and action icons on the left,
   * and searchbar on the right
   */
  _$topbar : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    // Global dispatcher.
    this._oGlobalDispatcher = oGlobalDispatcher

    // Topbar dom object.
    this._$topbar = $('<div class="ct-topbar"></div>');
  },

  $ : function() {
    return this._$topbar;
  }

  // no need for purge, because the topbar is persistant across the UI.

});
