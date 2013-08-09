"use strict";

/**
 * Menu
 *
 * Represent the part with the:
 *  - settings button
 *  - navigation arrows
 */
Cotton.UI.Topbar.Menu = Class.extend({

  /**
   * {DOM}
   * current element
   */
  _$menu : null,

  init : function(oGlobalDispatcher) {

    this._$menu = $('<div class="ct-menu_topbar"></div>');

    //settings icon, toggles (open/close) the settings panel on click
    this._$settings = $('<div class="ct-settings_menu_topbar"></div>').click(function(){
      oGlobalDispatcher.publish('toggle_settings');
    });

    this._$menu.append(this._$settings);
  },

  $ : function() {
    return this._$menu;
  }

});
