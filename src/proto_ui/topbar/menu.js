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

  /**
   * {DOM} logo in the topbar, goes back to the manager when clicked,
   **/
  _$logo : null,

  /**
   * {Cotton.UI.Topbar.HistoryArrows} object handling the history arrows, with their change
   * of color and behavior
   **/
  _oHistoryArrows : null,

  /**
   * {DOM} contains the two arrows
   **/
  _$arrows : null,

  /**
   * {DOM} settings gear in the topbar menu, opens and closes the settings panel
   **/
  _$settings : null,

  init : function(oGlobalDispatcher) {

    this._$menu = $('<div class="ct-menu_topbar"></div>');

    this._oHistoryArrows = new Cotton.UI.Topbar.HistoryArrows(oGlobalDispatcher);
    this._oPath = new Cotton.UI.Topbar.Path(oGlobalDispatcher);

    this._$favorites = $('<div class="ct-favorites_menu_topbar"></div>').click(function(){
      oGlobalDispatcher.publish('favorites');
      oGlobalDispatcher.publish('push_state', {
        'code': '?p=',
        'value': 'favorites'
      });
    });

    //settings icon, toggles (open/close) the settings panel on click
    this._$settings = $('<div class="ct-settings_menu_topbar"></div>').click(function(){
      oGlobalDispatcher.publish('toggle_settings');
    });

    this._$menu.append(this._oHistoryArrows.$(), this._oPath.$());
  },

  $ : function() {
    return this._$menu;
  }

});
