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
   * topbar search object, with the search input and button.
   */
  _oSearch : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    // Global dispatcher.
    this._oGlobalDispatcher = oGlobalDispatcher

    // Topbar dom object.
    this._$topbar_container = $('<div class="ct-topbar_container"></div>');
    this._$topbar = $('<div class="ct-topbar"></div>');

    // Home icon, opens the manager on click.
    this._$logo = $('<div class="ct-logo_topbar"></div>').click(function(){
      oGlobalDispatcher.publish('home');
    });

    this._oMenu = new Cotton.UI.Topbar.Menu(oGlobalDispatcher);
    this._oSearch = new Cotton.UI.Topbar.Search(oGlobalDispatcher);

    this._$topbar_container.append(
        this._$topbar.append(this._$logo, this._oMenu.$(), this._oSearch.$())
    );
  },

  $ : function() {
    return this._$topbar_container;
  }

  // no need for purge, because the topbar is persistant across the UI.

});
