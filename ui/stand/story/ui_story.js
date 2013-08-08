"use strict";

/**
 * UIStory is responsible for displaying data from a Cotton.Model.Story
 */
Cotton.UI.Stand.Story.UIStory = Class.extend({

  /**
   * {Cotton.Model.Story}
   */
  _oStory : null,

  init : function(oStory, oGlobalDispatcher) {
    var self = this;

    // dom object for the story container
    this._$story = $('<div class="ct-main_container ct-story"></div>');

    this.open(oStory);
  },

  $ : function() {
    return this._$story;
  },

  /**
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data to display.
   */
  open : function(oStory) {
    if (!this._oEpitome) {
      this._oEpitome = new Cotton.UI.Stand.Story.Epitome.UIEpitome();
      this._$story.append(this._oEpitome.$());
    }
  },

  purge : function() {
    this._oEpitome.purge();
    this._oEpitome = null;
    this._$story.remove();
    this._$story = null;
  }

});
