"use strict";

/**
 * UIStory is responsible for displaying data from a Cotton.Model.Story
 */
Cotton.UI.Stand.Story.UIStory = Class.extend({

  /**
   * {Cotton.Model.Story}
   */
  _oStory : null,

  init : function() {

  },

  /**
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data to display.
   */
  open : function(oStory) {
    console.log(oStory);
  }

});