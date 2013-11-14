"use strict";

/**
 * UICover
 *
 * Display a preview of the story in the shelf.
 */
Cotton.UI.Stand.Common.Cover.UICover = Class.extend({
  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * cover DOM element, contains the featured image of the stories
   * and links to the first historyItems of the story
   */
  _$cover : null,

  /**
   * {Cotton.UI.Stand.Common.Cover.Preview} Preview object
   **/
  _oPreview : null,

  /**
   * {Cotton.UI.Stand.Common.Sticker} Sticker object
   **/
  _oSticker : null,

  /**
   * @param {Cotton.Model.Story}
   *          oStory: data to display in the story.
   * @param {Cotton.Messaging.Dispatcher}
   *          oGlobalDispatcher:
   */
  init : function(oStory, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$cover = $('<div class="ct-cover"></div>');

    // Frame containing the poster.
    this._$frame = $('<div class="ct-sticker_frame"></div>');

    // The sticker is the left part of the cover, with the image and the title.
    this._oSticker = new Cotton.UI.Stand.Common.Sticker(oStory, 'cover', oGlobalDispatcher);

    this._iStoryId = oStory.id();
	  this._oStory = oStory;

    // Cross to delete the story.
    this._$favorite = $('<div class="ct-cover_action"></div>').click(function(){
      if ($(this).hasClass('ct-favorite_story')){
        // analytics tracking
        Cotton.ANALYTICS.favoriteStory('cover');
        oGlobalDispatcher.publish('favorite_story', {
          'story_id': self._iStoryId
        });
      } else {
        // the story is among the favorite, so clicking will unfavorite it
        // analytics tracking
        Cotton.ANALYTICS.unfavoriteStory('cover');
        oGlobalDispatcher.publish('unfavorite_story', {
          'story_id': self._iStoryId
        });
      }
    });

    if (this._oStory.isFavorite()) {
      this.favorite();
    } else {
      this.unfavorite();
    }

    this._oGlobalDispatcher.subscribe('favorite_story', this, function(dArguments){
      if (dArguments['story_id'] === self._iStoryId) {
        this.favorite();
      }
    });
    this._oGlobalDispatcher.subscribe('unfavorite_story', this, function(dArguments){
      if (dArguments['story_id'] === self._iStoryId) {
        this.unfavorite();
      }
    });

    // Cross to delete the story.
    this._$delete = $('<div class="ct-cover_action ct-delete_cover"></div>').text('Delete').click(function(){
      // analytics tracking
      Cotton.ANALYTICS.deleteStory();

      oGlobalDispatcher.publish('delete_story', {
        'story_id': self._iStoryId
      });
    });

    // The preview is the right part of the cover
    // with the 5 first links displayed and images on top
    this._oPreview = new Cotton.UI.Stand.Common.Cover.Preview(oStory,
        oGlobalDispatcher);

    this._oGlobalDispatcher.subscribe('remove_card', this, function(dArguments) {
      if (this._iStoryId === dArguments['story_id']) {
        oStory.removeHistoryItem(dArguments['history_item_id']);
        if (oStory.length() === 0) {
          // analytics tracking
          Cotton.ANALYTICS.deleteStory('all_cards_deleted');

          this._oGlobalDispatcher.publish('delete_story', {
            'story_id': self._iStoryId
          });
        } else {
          this._oPreview.refreshLinks(oStory);
        }
      }
    });

    this._oGlobalDispatcher.subscribe('append_new_card', this, function(dArguments){
      // a pool item has been selected in the card_adder.
      oStory.historyItems().unshift(dArguments['history_item']);
      this._oPreview.refreshLinks(oStory);
    });

    this._$cover.append(
      this._$frame.append(
        this._oSticker.$(),
        this._$favorite,
        this._$delete
      ),
      this._oPreview.$()
    );
  },

  $ : function() {
    return this._$cover;
  },

  id : function() {
    return this._iStoryId;
  },

  story : function() {
    return this._oStory;
  },

  /**
   * positions a cover on the manager
   **/
  setPosition : function(iTop, iLeft) {
    this._$cover.css({'top':iTop, 'left': iLeft});
  },

  setIndex : function(iIndex) {
    // have the first covers on top of z-index because you want the ones that move
    // on resize to be behind
    this._$cover.css('z-index', -iIndex);
  },

  animate : function() {
    this._$cover.addClass('ct-animate');
  },

  removeCover : function() {
    this.purge();
  },

  favorite : function() {
    this._oStory.setFavorite(1);
    this._$favorite.text('Unfavorite').removeClass('ct-favorite_story').addClass('ct-unfavorite_story');
  },

  unfavorite : function() {
    this._oStory.setFavorite(0);
    this._$favorite.text('Favorite').removeClass('ct-unfavorite_story').addClass('ct-favorite_story');
  },

  purge : function () {
    this._oGlobalDispatcher.unsubscribe('remove_card', this);
    this._oGlobalDispatcher.unsubscribe('append_new_card', this);
    this._oGlobalDispatcher.unsubscribe('favorite_story', this);
    this._oGlobalDispatcher.unsubscribe('unfavorite_story', this);
    this._oGlobalDispatcher = null;
    this._oStory = null;
    this._iStoryId = null;
    this._oSticker.purge();
    this._oSticker = null;
    this._$favorite.unbind('click').remove();
    this._$favorite = null;
    this._$delete.unbind('click').remove();
    this._$delete = null;
    this._$frame.remove();
    this._$frame = null;
    this._oPreview.purge();
    this._oPreview = null;
    this._$cover.remove();
    this._$cover = null;
  }

});
