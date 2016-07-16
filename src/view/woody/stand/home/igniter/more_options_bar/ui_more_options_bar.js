"use strict";

Cotton.UI.MoreOptions.UIMoreOptionsBar = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} black layer covering the world UI, containing the settings box.
   * if clicked (i.e. clicked outside of the box, the settings are closed)
   */
  _$settings_bar : null,

  /**
   * {DOM} rate_us button, link to the webstore for rating
   */
  _$rate_us_button : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    // If clicked outside the settings box, we close the settings.
    this._$settings_bar = $('<div class="ct-settings_bar"></div>');
    this._$show_rate_us_modal = $('<div class="ct-options show_rate_us_modal"><img src="media/images/topbar/stars_rating.svg" alt="Hamburger Menu"></div>');
    this._$show_settings_modal = $('<div class="ct-options show_settings_modal"><img src="media/images/topbar/settings.svg" alt="Hamburger Menu"></div>');
    this._$show_favorite_stories = $('<div class="ct-options show_favorite_stories"><img src="media/images/topbar/favorites.svg" alt="Hamburger Menu"></div>');

    this._$settings_bar.append(
        this._$show_rate_us_modal, this._$show_settings_modal, this._$show_favorite_stories
    );
  },

  $ : function() {
    return this._$settings_bar;
  }

});
