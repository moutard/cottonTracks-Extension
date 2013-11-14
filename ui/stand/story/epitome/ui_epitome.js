"use strict";

/**
 * UIEpitome
 *
 * Represent the summary of the story.
 */
Cotton.UI.Stand.Story.Epitome.UIEpitome = Class.extend({

  /**
   * {DOM} current element
   */
  _$epitome : null,

  /**
   * {DOM} parameters button
   **/
  _$params : null,

  /**
   * {DOM} related stories button
   **/
  _$related : null,


  init : function(oStory, iRelatedStories, oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._iRelatedStories = iRelatedStories;

    this._$epitome = $('<div class="ct-epitome"></div>');
    this.setBackground(oStory);
    this._oStory = oStory;

    // The poster is containing the image and the title.
    this._oSticker = new Cotton.UI.Stand.Common.Sticker(oStory, 'epitome', oGlobalDispatcher);

    this._$related = $('<div class="ct-epitome_button related_button">Related Stories ('
    + iRelatedStories + ')</div>').click(function(){
      if (self._iRelatedStories > 0){
        // analytics tracking
        Cotton.ANALYTICS.showRelated(self._iRelatedStories);

        self._oGlobalDispatcher.publish('related_stories');
        self._oGlobalDispatcher.publish('scrolloffset');
        self._$back_to_cards.removeClass('ct-hidden');
        $(this).addClass('ct-hidden');
      }
    });

    this._$favorite = $('<div class="ct-epitome_button"></div>').click(function(){
      if ($(this).hasClass('favorite_button')){
        // analytics tracking
        Cotton.ANALYTICS.favoriteStory('epitome');
        oGlobalDispatcher.publish('favorite_story', {
          'story_id': oStory.id()
        });
      } else {
        // the story is among the favorite, so clicking will unfavorite it
        // analytics tracking
        Cotton.ANALYTICS.unfavoriteStory('epitome');
        oGlobalDispatcher.publish('unfavorite_story', {
          'story_id': oStory.id()
        });
      }
    });

    if (oStory.isFavorite()) {
      this.favorite();
    } else {
      this.unfavorite();
    }

    this._oGlobalDispatcher.subscribe('favorite_story', this, function(dArguments){
      if (dArguments['story_id'] === self._oStory.id()) {
        this.favorite();
      }
    });
    this._oGlobalDispatcher.subscribe('unfavorite_story', this, function(dArguments){
      if (dArguments['story_id'] === self._oStory.id()) {
        this.unfavorite();
      }
    });

    if (this._iRelatedStories > 0) {
      this._$related.addClass('ct-active');
    }

    this._$back_to_cards = $('<div class="ct-epitome_button ct-back_button ct-hidden">Back</div>').click(function(){
      // analytics tracking
      Cotton.ANALYTICS.hideRelated();

      self._oGlobalDispatcher.publish('back_to_cards');
      self._oGlobalDispatcher.publish('scrolloffset');
      self._$related.removeClass('ct-hidden');
      $(this).addClass('ct-hidden');
    });

    this._$epitome.append(this._oSticker.$(), this._$favorite, this._$related, this._$back_to_cards);
  },

  $ : function() {
    return this._$epitome;
  },

  setBackground : function(oStory) {
    var iLength = oStory.historyItems().length;
    for (var i = 0; i < iLength; i++) {
      var historyItem = oStory.historyItems()[i];
      if (historyItem.extractedDNA().imageUrl()
        && historyItem.extractedDNA().imageUrl() !== oStory.featuredImage()) {
          this._$background = $('<div class="ct-epitome_background"></div>').css(
            'background-image', 'url("' + historyItem.extractedDNA().imageUrl() + '")');
          this._$epitome.prepend(this._$background);
          break;
      }
    }
  },

  decrementRelated : function() {
    this._iRelatedStories --;
    this._$related.text('Related Stories (' + this._iRelatedStories +')');
    if (this._iRelatedStories === 0) {
      this._oGlobalDispatcher.publish('back_to_cards');
      this._$related.removeClass('ct-active').removeClass('ct-hidden');
      this._$back_to_cards.addClass('ct-hidden');
    }
  },

  favorite : function() {
    this._oStory.setFavorite(1);
    this._$favorite.text('Remove from Favorites').removeClass('favorite_button').addClass('unfavorite_button');
  },

  unfavorite : function() {
    this._oStory.setFavorite(0);
    this._$favorite.text('Add to Favorites').removeClass('unfavorite_button').addClass('favorite_button');
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('favorite_story', this);
    this._oGlobalDispatcher.unsubscribe('unfavorite_story', this);
    this._oGlobalDispatcher = null;
    this._oStory = null;
    this._iRelatedStories = null;
    if (this._$background) {
      this._$background.remove();
      this._$background = null;
    }
    this._oSticker.purge();
    this._oSticker = null;
    this._$favorite.unbind('click').remove();
    this._$favorite = null;
    if (this._$related){
      this._$related.unbind('click');
      this._$related.remove();
      this._$related = null;
    } else {
      this._$back_to_cards.unbind('click');
      this._$back_to_cards.remove();
      this._$back_to_cards = null;
    }
    this._$epitome.remove();
    this._$epitome = null;
  }

});
