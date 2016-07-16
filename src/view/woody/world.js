'use strict';
/**
 * GLOBAL VARIABLES
 * for performance issues inline them when needed.
 */
var TOPBAR_HEIGHT = 74;
var DASHBOARD_WIDTH = 396;

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({
  /**
   * {DOM} current element that grab the whole page. (body)
   */
  _$world : null,

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,


  /**
   * DOM Listener, will listen all dom events and then dispatch what is needed through
   * the Global dispatcher. This is to avoid multiple same dom listener in various objects
   */
  _oWindowListener : null,

  /**
   * Topbar object, always present, containing menu and search
   */
  _oTopbar : null,

  /**
   * Manager object, representing the home, containing all covers
   * there is only one manager, and it is hidden/shown if needed
   */
  _oManager : null,

  /**
   * Settings object, with the rating button and the feedback form
   * if the form is empty and the settings is closed, it is purged.
   * otherwise it is just hidden to keep the text
   */
  _oSettings : null,


  /**
   * Ratings modal. Opens a feedback form to rate us and a link to the chrome store.
   * if the form is empty and the ratings are closed, it's purged.
   * otherwise it is just hidden to keep the text.
   * Lazy loaded.
   */
   _oRatingsModal : null,

  /**
   * Favorites modal. I am not sure that it should be a modal.
   * Lazy loaded.
   */
   _oFavoritesModal : null,

  /**
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oGlobalDispatcher, $dom_world) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oWindowListener = new Cotton.Messaging.WindowListener(this._oGlobalDispatcher);

    oGlobalDispatcher.subscribe('window_ready', this, function(){
      if (!self._bIsReady){
        self.createWorld();
      }
    });

    oGlobalDispatcher.subscribe('clear', this, function(){
      this.clear();
    });
  },

  createWorld : function($dom_world) {
    this._$world = $dom_world || $('.ct');
    this.initTopbar();
    this._bIsReady = true;
  },

  initTopbar : function() {
    this._oTopbar = new Cotton.UI.Topbar.UITopbar(this._oGlobalDispatcher);
    this._$world.append(this._oTopbar.$());
  },

  initRatingsModal : function() {
    if (!this._oRatingsModal) {
      this._oRatingsModal = new Cotton.UI.Ratings.UIRatings(this._oGlobalDispatcher);
      this._$ratings = this._oRatingsModal.$();
      this._$world.append(this._$ratings);
    }
  },

  toggleRatings : function() {
    if (!this._oRatingsModal) {
      this.initRatingsModal();
    }
    this._oRatingsModal.toggle();
  },

  toggleSettings : function() {
    // Settings Modal is lazy loaded for performance issue. Settings are not used frequently.
    if (!this._oSettingssModal) {
      this._oSettingsModal = new Cotton.UI.Settings.UISettings(this._oGlobalDispatcher);
      this._$settings = this._oSettingsModal.$();
      this._$world.append(this._$settings);
    }
    this._oSettingsModal.toggle();
  },

  toggleFavorites : function() {
    // Favorites Modal is lazy loaded for performance issue. Favorites are not used frequently.
    if (!this._oFavoritesModal) {
      this._oFavoritesModal = new Cotton.UI.Favorites.UIFavorites(this._oGlobalDispatcher);
      this._$favorites = this._oFavoritesModal.$();
      this._$world.append(this._$favorites);
    }
    this._oFavoritesModal.toggle();
  },

  /**
   * @param{boolean} bPurge
   *   if the form is empty, we purge the settings object
   *   otherwise we juste hide it
   **/
   closeRatings : function(bPurge) {
     if (this._oRatingsModal) {
       if (bPurge) {
         this._oRatingsModal.purge();
         this._oRatingsModal = null;
         this._$ratings.remove();
         this._$ratings = null;
       } else {
         this._oRatings.hide();
       }
     }
   },

  openHome :  function(dArguments) {
    var self = this;
    document.title = "cottonTracks";
    var bFromPopState = dArguments && dArguments['from_popstate'];
    // need to clear, in case we landed first on a story with a url "woody.html?sid=42"
    if (!this._oHome){
      if (!bFromPopState) {
        this._oGlobalDispatcher.publish('push_state', {
          'code': "",
          'value': ""
        });
      }
      this.clear();
      this._oHome = new Cotton.UI.Stand.Home.UIHome(this._oGlobalDispatcher);
      this._$world.append(this._oHome.$());
      setTimeout(function(){
        self._oGlobalDispatcher.publish('focus_creator');
      }, 100);
    }
  },

  hideHome : function() {
    if (this._oHome) {
      this._oHome.purge();
      this._oHome = null;
    }
  },

  openCheesecake : function(oCheesecake) {
    document.title = "cottonTracks";
    // need to clear, in case we landed first on a story with a url "woody.html?sid=42"
    if (!this._oUICheesecake) {
      this.clear();
      this._oUICheesecake = new Cotton.UI.Stand.Cheesecake.UICheesecake(oCheesecake, this._oGlobalDispatcher);
      this._$world.append(this._oUICheesecake.$());
    }
  },

  hideCheesecake : function() {
    if (this._oUICheesecake) {
      this._oUICheesecake.purge();
      this._oUICheesecake = null;
    }
  },

  deleteCheesecake : function(iId) {
    if (this._oUICheesecake) {
      this._oGlobalDispatcher.publish('home');
    } else if (this._oHome){
      this._oHome.removeCheesecake(iId);
    }
  },

  clear : function() {
    // clear everything except topbar
    this.hideHome();
    this.hideCheesecake();
  },

  isReady : function() {
    return this._bIsReady;
  }

});
