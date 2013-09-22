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

  /**
   * {DOM} story container
   */
  _$story : null,

  /**
   * {DOM} story container
   */
  _$story_container : null,

  init : function(oStory, oGlobalDispatcher) {
    var self = this;

    // DOM object for the story container.
    this._$story = $('<div class="ct-story"></div>');

    this._$story_container = $('<div class="ct-story_container"></div>');

    this._oDashboard = new Cotton.UI.Stand.Story.Dashboard(oStory, oGlobalDispatcher);
    this._oDeck = new Cotton.UI.Story.Deck(oStory, oGlobalDispatcher);
    this._$story.append(
      this._$story_container.append(
        this._oDashboard.$(),
        this._oDeck.$()
      )
    );

    this._$story.bind('mousewheel',function(){
      self._oDashboard.pushBack();
      if (!self._bScrolling) {
        self._bScrolling = true;
        self._oScrollTimeout = setTimeout(function(){
          self._bScrolling = false;
          self._oDashboard.bringFront();
        }, 600);
      }
    });

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
    // Clear the timeout, otherwise we could try asyncronously to access the _oDashboard
    // that has already been purged. ex: swipe right to go to previous page.
    clearTimeout(this._oScrollTimeout);
    this._oScrollTimeout = null;
    this._bScrolling = null;
    this._oDeck.purge();
    this._oDeck = null;
    this._oDashboard.purge();
    this._oDashboard = null;
    this._$story.unbind('mousewheel').remove();
    this._$story = null;
  }

});
