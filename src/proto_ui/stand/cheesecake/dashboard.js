"use strict";

/**
 * Dashboard
 *
 * For the moment only contains the epitome, but the blank space under the
 * epitome can be filled by the something.
 */
Cotton.UI.Stand.Cheesecake.Dashboard = Class.extend({
  /**
   * {DOM} current element.
   */
  _$dashboard : null,


  init : function(oCheesecake, oGlobalDispatcher) {
    this._$dashboard = $('<div class="ct-story_dashboard"></div>');
    this._oSticker = new Cotton.UI.Stand.Common.Sticker(oCheesecake, 'cheesecake', oGlobalDispatcher);
    this._oQuickAdder = new Cotton.UI.Stand.Cheesecake.QuickAdder(oCheesecake, oGlobalDispatcher);
    this._$dashboard.append(this._oSticker.$(), this._oQuickAdder.$());
  },

  $ : function() {
    return this._$dashboard;
  },

  updateStickerImage : function(sImageUrl) {
    this._oSticker.updateImage(sImageUrl);
  },

  getSuggestions : function() {
    return this._oQuickAdder.getSuggestions();
  },

  purge : function () {
    this._$dashboard.remove();
    this._$dashboard = null;
  },

});