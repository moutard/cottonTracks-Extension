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

  init : function(oStory, iRelatedStories, oGlobalDispatcher) {

    this._$dashboard = $('<div class="ct-story_dashboard"></div>');
    this._oEpitome = new Cotton.UI.Stand.Story.Epitome.UIEpitome(oStory, iRelatedStories,
      oGlobalDispatcher);

    this._$dashboard.append(this._oEpitome.$());

  },

  $ : function() {
    return this._$dashboard;
  },

  pushBack : function() {
    this._$dashboard.addClass('ct-pushed_back');
  },

  bringFront : function() {
    this._$dashboard.removeClass('ct-pushed_back');
  },

  decrementRelated : function() {
    this._oEpitome.decrementRelated();
  },

  purge : function () {
    this._oEpitome.purge();
    this._$dashboard.remove();
    this._$dashboard = null;
  },

});

