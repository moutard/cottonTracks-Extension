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
   * {Cotton.UI.Stand.Story.RelatedDeck}
   */
  _oRelatedDeck : null,

  /**
   * {DOM} story container
   */
  _$story : null,

  /**
   * {DOM} story container
   */
  _$story_container : null,

  init : function(oStory, lRelatedStories, oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;

    // DOM object for the story container.
    this._$story = $('<div class="ct-story"></div>');

    this._$story_container = $('<div class="ct-story_container"></div>');

    this._oDashboard = new Cotton.UI.Stand.Story.Dashboard(oStory, lRelatedStories.length, oGlobalDispatcher);
    this._oDeck = new Cotton.UI.Stand.Story.Deck(oStory, oGlobalDispatcher);

    this._$story.append(
      this._$story_container.append(
        this._oDashboard.$(),
        this._oDeck.$()
      )
    );

    this._oGlobalDispatcher.subscribe('window_scroll', this, function(){
      self._oDashboard.pushBack();
      if (!self._bScrolling) {
        self._bScrolling = true;
        self._oScrollTimeout = setTimeout(function(){
          self._bScrolling = false;
          self._oDashboard.bringFront();
        }, 600);
      }
    });

    this._oGlobalDispatcher.subscribe('related_stories', this, function(){
      this.hideCards();
      this.showRelatedStories(oStory, lRelatedStories);
    });

    this._oGlobalDispatcher.subscribe('back_to_cards', this, function(){
      this.hideRelatedStories();
      this.showCards();
    });

    this._oGlobalDispatcher.subscribe('remove_cover', this, function(dArguments){
      this.removeRelatedCover(dArguments['story_id']);
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

  hideCards : function() {
    this._oDeck.hide();
  },

  showCards : function() {
    this._$story_container.append(this._oDeck.$());
  },

  showRelatedStories : function(oStory, lRelatedStories) {
    this._oRelatedDeck = new Cotton.UI.Stand.Story.RelatedDeck(this._oGlobalDispatcher);
    this._$story_container.append(this._oRelatedDeck.$());
    // We append the related deck before the covers so that it has a width
    this._oRelatedDeck.appendRelatedStories(lRelatedStories, oStory);
  },

  hideRelatedStories : function() {
    this._oRelatedDeck.purge();
    this._oRelatedDeck = null;
  },

  removeRelatedCover : function(iStoryId) {
    this._oDashboard.decrementRelated();
    if (this._oRelatedDeck) {
      // if it was the last related cover, decrementRelated called 'back_to_story'
      // that has already purged the _oRelatedDeck
      this._oRelatedDeck.removeCover(iStoryId);
    }
  },

  purge : function() {
    // Clear the timeout, otherwise we could try asyncronously to access the _oDashboard
    // that has already been purged. ex: swipe right to go to previous page.
    this._oGlobalDispatcher.unsubscribe('window_scroll', this);
    this._oGlobalDispatcher.unsubscribe('related_stories', this);
    this._oGlobalDispatcher.unsubscribe('back_to_cards', this);
    this._oGlobalDispatcher.unsubscribe('remove_cover', this);
    this._oGlobalDispatcher = null;
    clearTimeout(this._oScrollTimeout);
    this._oScrollTimeout = null;
    this._bScrolling = null;
    this._oDeck.purge();
    this._oDeck = null;
    if (this._oRelatedDeck) {
      this._oRelatedDeck.purge();
      this._oRelatedDeck = null;
    }
    this._oDashboard.purge();
    this._oDashboard = null;
    this._$story.remove();
    this._$story = null;
  }

});
