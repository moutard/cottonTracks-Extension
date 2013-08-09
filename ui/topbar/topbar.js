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
   * logo at the bottom left of the topbar, to go back to the manager
   */
  _$logo : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    // Global dispatcher.
    this._oGlobalDispatcher = oGlobalDispatcher

    // Topbar dom object.
    this._$topbar = $('<div class="ct-topbar"></div>');

    // Home icon, opens the manager on click.
    this._$logo = $('<div class="ct-logo_topbar"></div>').click(function(){
      oGlobalDispatcher.publish('home');
    });
    this._$topbar.append(this._$logo);
  },

  $ : function() {
    return this._$topbar;
  }

  // no need for purge, because the topbar is persistant across the UI.

});