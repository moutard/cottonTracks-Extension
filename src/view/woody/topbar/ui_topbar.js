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
    * topbar menu object, with the navigation arrows, the settings gear
    */
  _oMenu : null,

   /**
    * topbar search object
    */
  _oSearch : null,
  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    // Global dispatcher.
    this._oGlobalDispatcher = oGlobalDispatcher

    // Topbar dom object.
    this._$topbar = $('<div class="ct-topbar"></div>');
    this._$topbar_container = $('<div class="ct-topbar_container"></div>');

    // Home icon, opens the manager on click.
    this._$logo = $('<span class="ct-logo_topbar"></span>').click(function(){
      oGlobalDispatcher.publish('home');
    });

    this._oMenu = new Cotton.UI.Topbar.Menu(oGlobalDispatcher);
    this._oSearch = new Cotton.UI.Topbar.Search(oGlobalDispatcher);

    this._$hamburger_menu = $('<div class="svg ct-topbar_hamburger_menu"><img src="media/images/topbar/hamburger_menu.svg" alt="Hamburger Menu"></div>').click(function() {
        oGlobalDispatcher.publish("toggle_hamburger_menu");
    });

    this._$topbar.append(
        this._$logo,
        this._$topbar_container.append(this._oMenu.$(), this._oSearch.$(), this._$hamburger_menu)
    );
  },

  $ : function() {
    return this._$topbar;
  }

  // no need for purge, because the topbar is persistant across the UI.

});
