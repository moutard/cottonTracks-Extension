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

    this._$epitome.append(this._oSticker.$(), this._$related, this._$back_to_cards);
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

  purge : function() {
    this._oGlobalDispatcher = null;
    this._iRelatedStories = null;
    if (this._$background) {
      this._$background.remove();
      this._$background = null;
    }
    this._oSticker.purge();
    this._oSticker = null;
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
