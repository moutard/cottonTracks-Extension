'use strict';

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
   * Messenger for handling core message. (Chrome message)
   */
  _oCoreMessenger : null,

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
   * @param {Cotton.Core.Messenger} oCoreMessenger
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oCoreMessenger, oGlobalDispatcher, $dom_world) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oWindowListener = new Cotton.Messaging.WindowListener(this._oGlobalDispatcher);

    oGlobalDispatcher.subscribe('window_ready', this, function(dArguments){
      self._init();
    });
  },

  _init : function($dom_world) {
    this._$world = $dom_world || $('.ct');
    this.initTopbar();
    this.initManager();
    this._bIsReady = true;
  },

  initTopbar : function() {
    this._oTopbar = new Cotton.UI.Topbar.UITopbar(this._oGlobalDispatcher);
    this._$world.append(this._oTopbar.$());
    this._oGlobalDispatcher.publish('focus_search');
  },

  initManager : function() {
    this._oManager = new Cotton.UI.Stand.Manager.UIManager(this._oGlobalDispatcher);
    this._$world.append(this._oManager.$());
    this._oManager.setShelvesHeight();
  },

  loadManager : function(lStories) {
    this._oManager.createShelves(lStories);
  },

  openStory : function(oStory) {
    this._oManager.hide();
    this._oUIStory = this._oUIStory || new Cotton.UI.Stand.Story.UIStory(oStory,
        this._oGlobalDispatcher)
    this._oUIStory.drawCards(oStory);
    this._$world.append(this._oUIStory.$());
  },

  hideStory : function(){
    if (this._oUIStory) {
      this._oUIStory.purge();
      this._oUIStory = null;
    }
  },

  initSettings : function() {
    if (!this._oSettings) {
      this._oSettings = new Cotton.UI.Settings.Settings(this._oGlobalDispatcher);
      this._$settings = this._oSettings.$();
      this._$world.append(this._$settings);
    }
  },

  toggleSettings : function() {
    if (!this._oSettings) {
      this.initSettings();
    }
    this._oSettings.toggle();
  },

  /**
   * @param{boolean} bPurge
   *   if the form is empty, we purge the settings object
   *   otherwise we juste hide it
   **/
  closeSettings : function(bPurge) {
    if (this._oSettings){
      if (bPurge) {
        this._oSettings.purge();
        this._oSettings = null;
        this._$settings.remove();
        this._$settings = null;
      } else {
        this._oSettings.hide();
      }
    }
  },

  openManager : function() {
    if (this._oManager.isDetached()){
      // the manager is not visible, clear everything and attach it.
      this.clear();
      this._$world.append(this._oManager.$());
      this._oManager.attached();
    }
  },

  clear : function() {
    this.hideStory();
    this.closeSettings();
  },

  isReady : function() {
    return this._bIsReady;
  }

});
