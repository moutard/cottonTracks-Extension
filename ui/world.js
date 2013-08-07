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
   * @param {Cotton.Core.Messenger} oCoreMessenger
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oCoreMessenger, oGlobalDispatcher, $dom_world) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oWindowListener = new Cotton.Messaging.WindowListener(this._oGlobalDispatcher);
    this._$world = $dom_world || $('.ct');
  },

  initTopbar : function() {
    this._oTopbar = new Cotton.UI.Topbar.UITopbar(this._oGlobalDispatcher);
    this._$world.append(this._oTopbar.$());
    this._oGlobalDispatcher.publish('focus_search');
  },

  initManager : function(lStories) {
    this._oManager = new Cotton.UI.Stand.Manager.UIManager(lStories, this._oGlobalDispatcher);
    this._$world.append(this._oManager.$());
  }

});
