"use strict";

/**
 * Dashboard
 *
 * For the moment only contains the epitome, but the blank space under the
 * epitome can be filled by the something.
 */
Cotton.UI.Stand.Story.Dashboard = Class.extend({
  /**
   * {DOM} current element.
   */
  _$dashboard : null,

  /**
   * {Cotton.UI.Stand.Story.Epitome.UIEpitome}
   */
  _oEpitome : null,

  init : function(oStory, oGlobalDispatcher) {

    this._$dashboard = $('<div class="ct-story_dashboard"></div>');
    this._oEpitome = new Cotton.UI.Stand.Story.Epitome.UIEpitome(oStory,
      oGlobalDispatcher);

    this._$dashboard.append(this._oEpitome.$());

  },

  $ : function() {
    return this._$dashboard;
  },

  purge : function () {
    this._oEpitome.purge();
    this._$dashboard.remove();
    this._$dashboard = null;
  },

});

