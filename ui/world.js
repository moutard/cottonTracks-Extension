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
      if (!self._bIsReady){
        self.createWorld();
      }
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
    this._oGlobalDispatcher.publish('focus_search');
  },

  initManager : function() {
    document.title = "cottonTracks";
    // need to clear, in case we landed first on a story with a url "lightyear.html?sid=42"
    // careful not to clear after manager is created, because otherwhise it is considered
    // as detached and makes it possible to call the manager from the manager with the
    // home button (messes with the navigation by introducing a page then)
    this.clear();
    this._oManager = new Cotton.UI.Stand.Manager.UIManager(this._oGlobalDispatcher);
    this._$world.append(this._oManager.$());
  },

  openStory : function(oStory, lRelatedStories) {
    document.title = oStory.title() + " - cottonTracks" ;
    this._oGlobalDispatcher.publish('scrolloffset', {});
    this.clear();
    this._oUIStory = this._oUIStory || new Cotton.UI.Stand.Story.UIStory(oStory, lRelatedStories,
        this._oGlobalDispatcher)
    this._$world.append(this._oUIStory.$());
    // draw the story content after it has been attached to the dom, so that elements can
    // know their height or width (0 as long as not attached to the dom)
    this._oUIStory.drawCards(oStory);
  },

  hideStory : function(){
    if (this._oUIStory) {
      this._oUIStory.purge();
      this._oUIStory = null;
    }
  },

  hideManager : function() {
    if (this._oManager){
      this._oManager.hide();
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

  openManager : function(dArguments) {
    this._oGlobalDispatcher.publish('scrolloffset', {});
    if (this._oManager) {
      if (this._oManager.isDetached()){
        document.title = "cottonTracks";
        // the manager is not visible, clear everything and attach it.
        this.clear();
        this._$world.append(this._oManager.$());
        this._oManager.attached();
        // We use a new message 'open_manager' because the 'home' message can result
        // in no action( we were already on the manager and clicked the home button).
        this._oGlobalDispatcher.publish('open_manager', dArguments);
        Cotton.ANALYTICS.openManager(dArguments);
      }
    } else {
      // no manager, init
      this.clear();
      this.initManager();
      // init manager and start appending stories
      this._oGlobalDispatcher.publish('open_manager', dArguments);
      Cotton.ANALYTICS.openManager(dArguments);
    }
  },

  /**
   * open a generic partial that contains stories.
   */
  openPartial : function(lPartialStories, sPartialTitle, sEmptyMessage) {
    document.title = sPartialTitle + " - cottonTracks search results" ;
    this._oGlobalDispatcher.publish('scrolloffset', {});
    this.clear();
    this._oUIPartial = new Cotton.UI.Stand.Partial.UIPartial(lPartialStories,
        sPartialTitle, sEmptyMessage, this._oGlobalDispatcher);
    this._$world.append(this._oUIPartial.$());
  },

  hidePartial : function() {
    if (this._oUIPartial) {
      this._oUIPartial.purge();
      this._oUIPartial = null;
    }
  },

  clear : function() {
    // clear everything except topbar
    this.hideManager();
    this.hideStory();
    this.hidePartial();
    this.closeSettings();
  },

  isReady : function() {
    return this._bIsReady;
  }

});
