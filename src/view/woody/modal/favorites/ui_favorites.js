"use strict";

Cotton.UI.Favorites.UIFavorites = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} black layer covering the world UI, containing the settings box.
   * if clicked (i.e. clicked outside of the box, the settings are closed)
   */
  _$favorites : null,

  /**
   * {DOM} actual box with the settings
   */
  _$box : null,

  /**
   * {DOM} settings title
   */
  _$title : null,

  /**
   * {DOM} cross to close the settings page
   */
  _$close : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    // If clicked outside the settings box, we close the settings.
    this._$favorites = $('<div class="ct-settings"></div>').click(function(e){
      if (e.target === this) {
        self.toggle('click_out');
      }
    });

    // Actual settings box.
    this._$box = $('<div class="ct-settings_box"></div>');

    // Settings title.
    this._$title = $('<div class="ct-settings_box_title">Favorites</div>');

    // Rate us.
    this._$settings_content = $('<p>Favorites are coming soon.</p>');

    // Cross for closing the settings page.
    this._$close = $('<div class="ct-close_settings_box"></div>').click(function(){
      self.toggle('click_cross');
    });

    // Exit settings when ESC key is press down.
    this._oGlobalDispatcher.subscribe('escape', this, function(){
      this.close('press_esc');
    });

    this._$favorites.append(
      this._$box.append(
        this._$title,
        this._$settings_content,
        this._$close
      )
    );
  },

  $ : function() {
    return this._$favorites;
  },

  /**
   * Toggle
   *
   * Toggle between closed and show. Called by the topbar settings button
   * (gears).
   */
  toggle : function() {
    if (this._$favorites.hasClass('ct-show')) {
      this._hide();
    } else {
      this._show();
    }
  },

  /**
   * Show
   *
   * Triggered by the toggle method if settings are already hidden.
   */
  _show : function() {
    this._$favorites.addClass("ct-show");
    // analytics tracking
    Cotton.ANALYTICS.openSettings();
  },

  /**
   * Hide
   *
   * Just hide (triggered if there is some text in the form, to avoid
   * to loose you data).
   */
  _hide : function() {
    this._$favorites.removeClass("ct-show");
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('keydown', this);
    this._oGlobalDispatcher = null;
    this._$title = null;
    this._$close.unbind('click');
    this._$close = null;
    this._$box.empty();
    this._$box = null;
    this._$favorites.empty();
    this._$favorites.unbind('click');
    this._$favorites = null;
  }

});
