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
   * {Cotton.UI.Stand.Story.Dashboard}
   */
  _oDashboard : null,

  /**
   * {Cotton.UI.Stand.Story.Deck}
   */
  _oDeck : null,

  init : function(oStory, oGlobalDispatcher) {
    var self = this;

    // DOM object for the story container
    this._$story = $('<div class="ct-main_container ct-story"></div>');

    this._oDashboard = new Cotton.UI.Stand.Story.Dashboard(oStory, oGlobalDispatcher);
    this._oDeck = new Cotton.UI.Stand.Story.Deck(oStory, oGlobalDispatcher);
    this._$story.append(this._oDashboard.$(), this._oDeck.$());

    },

  $ : function() {
    return this._$story;
  },

  /**
   * draw the cards by the card deck
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data to display.
   */
  drawCards : function(oStory) {
    this._oDeck.drawCards(oStory);
  },

  purge : function() {
    this._oDeck.purge();
    this._oDeck = null;
    this._oDashboard.purge();
    this._oDashboard = null;
    this._$story.remove();
    this._$story = null;
  }

});
