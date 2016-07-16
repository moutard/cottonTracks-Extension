"use strict";

Cotton.UI.Settings.UISettings = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} black layer covering the world UI, containing the settings box.
   * if clicked (i.e. clicked outside of the box, the settings are closed)
   */
  _$settings : null,

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
    this._$settings = $('<div class="ct-settings"></div>').click(function(e){
      if (e.target === this) {
        self.toggle('click_out');
      }
    });

    // Actual settings box.
    this._$box = $('<div class="ct-settings_box"></div>');

    // Settings title.
    this._$title = $('<div class="ct-settings_box_title">Settings</div>');

    // Rate us.
    this._$settings_content = $('<p>Settings are coming soon.</p>');

    // Cross for closing the settings page.
    this._$close = $('<div class="ct-close_settings_box"></div>').click(function(){
      self.toggle('click_cross');
    });

    // Exit settings when ESC key is press down.
    this._oGlobalDispatcher.subscribe('escape', this, function(){
      this.close('press_esc');
    });

    this._$settings.append(
      this._$box.append(
        this._$title,
        this._$settings_content,
        this._$close
      )
    );
  },

  $ : function() {
    return this._$settings;
  },

  /**
   * Toggle
   *
   * Toggle between closed and show. Called by the topbar settings button
   * (gears).
   */
  toggle : function() {
    if (this._$settings.hasClass('ct-show')) {
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
    this._$settings.addClass("ct-show");
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
    this._$settings.removeClass("ct-show");
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('keydown', this);
    this._oGlobalDispatcher = null;
    this._$title = null;
    this._$close.unbind('click');
    this._$close = null;
    this._$box.empty();
    this._$box = null;
    this._$settings.empty();
    this._$settings.unbind('click');
    this._$settings = null;
  }

});
