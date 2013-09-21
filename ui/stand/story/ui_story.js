"use strict";

/**
 * UIStory is responsible for displaying data from a Cotton.Model.Story
 */
Cotton.UI.Stand.Story.UIStory = Class.extend({

  /**
   * {Cotton.Model.Story}
   */
  _oStory : null,

  /**
   * {Cotton.UI.Story.Dashboard}
   */
  _oDashboard : null,

  init : function(oStory, oGlobalDispatcher) {
    var self = this;

    // dom object for the story container
    this._$story = $('<div class="ct-main_container ct-story"></div>');

    this._oDashboard = new Cotton.UI.Stand.Story.Dashboard(oStory, oGlobalDispatcher);
    this._$story.append(this._oDashboard.$());
  },

  $ : function() {
    return this._$story;
  },

  /**
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data to display.
   */
  open : function(oStory) {
  },

  purge : function() {
    this._oDashboard.purge();
    this._oDashboard = null;
    this._$story.remove();
    this._$story = null;
  }

});
