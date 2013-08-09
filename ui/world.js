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

    this._$world = $dom_world || $('.ct');
  },

  initTopbar : function() {
    this._oTopbar = new Cotton.UI.Topbar.UITopbar(this._oGlobalDispatcher);
    this._$world.append(this._oTopbar.$());
    this._oGlobalDispatcher.publish('focus_search');
  },

  initManager : function(lStories) {
    console.log(lStories);
  }

});
