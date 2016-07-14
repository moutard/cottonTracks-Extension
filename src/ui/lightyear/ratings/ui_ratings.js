"use strict";

Cotton.UI.Ratings.UIRatings = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} black layer covering the world UI, containing the settings box.
   * if clicked (i.e. clicked outside of the box, the settings are closed)
   */
  _$ratings : null,

  /**
   * {DOM} actual box with the settings
   */
  _$box : null,

  /**
   * {DOM} settings title
   */
  _$title : null,

  /**
   * {DOM} container with a rate us button and some text
   */
  _$rate_us : null,

  /**
   * {DOM} rate_us button, link to the webstore for rating
   */
  _$rate_us_button : null,

  /**
   * {DOM} rate_us text asking for rating
   */
  _$rate_us_text : null,

  /**
   * {Cotton.UI.Settigns.Feedback} Feedback object, with the form
   */
  _oFeedback : null,

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
    this._$ratings = $('<div class="ct-settings"></div>').click(function(e){
      if (e.target === this) {
        self.close('click_out');
      }
    });

    // Actual settings box.
    this._$box = $('<div class="ct-settings_box"></div>');

    // Settings title.
    this._$title = $('<div class="ct-settings_box_title">Settings</div>');

    // Rate us.
    this._$rate_us = $('<div class="ct-rate_us"></div>');
    this._$rate_us_button = $('<a class="ct-rate_us_button" href='
      + this.webstoreUrl() + ' target="_blank">Rate us</a>').click(function(){
        // analytics tracking
        Cotton.ANALYTICS.rateUs(self.webstoreUrl());
      });
    this._$rate_us_text = $('<p class="ct-rate_us_text">Rate us on ' + this.webstoreName() +'</p>');

    // Feedback form object.
    this._oFeedback = new Cotton.UI.Ratings.Feedback();

    // Cross for closing the settings page.
    this._$close = $('<div class="ct-close_settings_box"></div>').click(function(){
      self.close('click_cross');
    });

    // Exit settings when ESC key is press down.
    this._oGlobalDispatcher.subscribe('escape', this, function(){
      this.close('press_esc');
    });

    this._$ratings.append(
      this._$box.append(
        this._$title,
        this._$rate_us.append(
          this._$rate_us_button,
          this._$rate_us_text
        ),
        this._oFeedback.$(),
        this._$close
      )
    );
  },

  $ : function() {
    return this._$ratings;
  },

  /**
   * WebstoreUrl
   *
   * return the url of the webstore using the core function.
   */
  webstoreUrl : function() {
    var oWebstore = new Cotton.Core.Webstore();
    return oWebstore.getUrl();
  },

  /**
   * WebstoreName
   *
   * return the name of the webstore using the core function.
   */
  webstoreName : function() {
    var oWebstore = new Cotton.Core.Webstore();
    return oWebstore.getName();
  },

  /**
   * Toggle
   *
   * Toggle between closed and show. Called by the topbar settings button
   * (gears).
   */
  toggle : function() {
    if (this._$ratings.hasClass('ct-show')) {
      this.close();
    } else {
      this.show();
    }
  },

  /**
   * Show
   *
   * Triggered by the toggle method if settings are already hidden.
   */
  show : function() {
    this._$ratings.addClass("ct-show");
    // analytics tracking
    Cotton.ANALYTICS.openSettings();
  },

  /**
   * Hide
   *
   * Just hide (triggered if there is some text in the form, to avoid
   * to loose you data).
   */
  hide : function() {
    this._$ratings.removeClass("ct-show");
  },

  /**
   * Close
   *
   * When you close the settings if your feedback are empty then settings
   * are purge. Else settings are kept, and just hide.
   */
  close : function(sCloseMedium) {
    Cotton.ANALYTICS.closeSettings(sCloseMedium);
    var bPurge = this._oFeedback.feedbackText() === "";
    this._oGlobalDispatcher.publish('close_ratings', {"purge" : bPurge});
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('keydown', this);
    this._oGlobalDispatcher = null;
    this._$rate_us_button.unbind('click')
    this._$rate_us_button = null;
    this._$rate_us_text = null;
    this._$rate_us.empty().remove();
    this._$rate_us = null;
    this._$title = null;
    this._oFeedback.purge();
    this._oFeedback = null;
    this._$close.unbind('click');
    this._$close = null;
    this._$box.empty();
    this._$box = null;
    this._$ratings.empty();
    this._$ratings.unbind('click');
    this._$ratings = null;
  }

});
