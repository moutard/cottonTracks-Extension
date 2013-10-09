"use strict";

/**
 * Deck
 *
 * Contains all the cards.
 */
Cotton.UI.Stand.Story.RelatedDeck = Class.extend({
  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} right column of the story, with all the related stories, instead of the card deck
   */
  _$related_deck : null,

  /**
   * {array} array containing all the related covers
   */
  _lRelatedCovers : null,

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$related_deck = $('<div class="ct-story_deck ct-related_deck"></div>');
    this._lRelatedCovers = [];

    this._oGlobalDispatcher.subscribe('window_resize', this, function(){
      this.positionCovers(this._computeSlots());
    });

  },

  $ : function() {
    return this._$related_deck;
  },

  hide : function() {
    this._$related_deck.detach();
  },

  appendRelatedStories : function(lRelatedStories, oStory) {
    if (!this._$related_covers) {
      this._$related_stories = $('<div class="ct-related_stories"></div>');
      var iLength = lRelatedStories.length;

      //sort related stories by highest score
      for (var i = 0; i < iLength; i++){
        lRelatedStories[i]['scoreToStory'] = Cotton.Algo.Score.Object.storyToStory(
          oStory, lRelatedStories[i]);
      }
      lRelatedStories.sort(function(a,b){
        return b['scoreToStory'] - a['scoreToStory'];
      });

      var iSlotsPerLine = this._computeSlots();
      for (var i = 0; i < iLength; i++) {
        var oRelatedCover =
          new Cotton.UI.Stand.Common.Cover.UICover(lRelatedStories[i], this._oGlobalDispatcher);
        this._lRelatedCovers.push(oRelatedCover);
        this._$related_deck.append(oRelatedCover.$().addClass('ct-related_cover'));
        this.positionOneCover(oRelatedCover, i, iSlotsPerLine);
        oRelatedCover.$().css('top');
        oRelatedCover.animate();
        oRelatedCover.setIndex(i);
      }
    }
    this.setHeight(this._computeSlots());
  },

  _computeSlots : function() {
    // we store the manager width in case an operation is done while manager is detached.
    var iDeckWidth = this._$related_deck.width();
    var COVER_WIDTH = 396;
    var COVER_MARGIN = 25;
    // The container can always have 1 or 2 covers per line
    var iSlotsPerLine = (iDeckWidth <= (COVER_WIDTH * 2) + (COVER_MARGIN)) ? 1 : 2;
    return iSlotsPerLine;
  },

  /**
   * positions a cover on the manager depending on its position in the cover_container
   * and the number of slots per row available
   * @param {int} iSlotsPerRow:
   *    the number of covers you can put on a line
   **/
  positionOneCover : function(oCover, iPosition, iSlotsPerLine) {
    var iPositionOnRow = iPosition % iSlotsPerLine;
    var COVER_HEIGHT = 250;
    var COVER_WIDTH = 396;
    var TOP_MARGIN = 22;
    var LEFT_MARGIN = 25;

    var iTop = (Math.floor(iPosition / iSlotsPerLine)) * (COVER_HEIGHT + TOP_MARGIN);
    var iLeft = (iPositionOnRow) * (COVER_WIDTH + LEFT_MARGIN);
    oCover.setPosition(iTop, iLeft);
  },

  positionCovers : function(iSlotsPerLine) {
    var iLength = this._lRelatedCovers.length;
    for (var i = 0; i < iLength; i++) {
      this.positionOneCover(this._lRelatedCovers[i], i, iSlotsPerLine);
    }
    this.setHeight(iSlotsPerLine);
  },

  setHeight : function(iSlotsPerLine) {
    var COVER_HEIGHT = 250;
    var TOP_MARGIN = 22;
    var iHeight = Math.ceil(this._lRelatedCovers.length / iSlotsPerLine)
      * (COVER_HEIGHT + TOP_MARGIN);
    this._$related_deck.css('height', iHeight);
  },

  removeCover : function(iStoryId) {
    var lRemainingCovers = [];
    var iSlotsPerLine = this._computeSlots();
    var iLength = this._lRelatedCovers.length;
    for (var i = 0; i < iLength; i++) {
      if (this._lRelatedCovers[i].id() === iStoryId) {
        // the cover of the cover to delete
        this._lRelatedCovers[i].purge();
        var bDeleted = true;
      } else {
        if (bDeleted) {
          // Covers after the deleted one need to be repositioned.
          this.positionOneCover(this._lRelatedCovers[i], i-1, iSlotsPerLine);
        }
        lRemainingCovers.push(this._lRelatedCovers[i]);
      }
      this._lRelatedCovers[i] = null;
    }
    this._lRelatedCovers = null;
    this._lRelatedCovers = lRemainingCovers;
  },

  purgeRelatedCovers : function() {
    if (this._lRelatedCovers) {
      var iLength = this._lRelatedCovers.length;
    }
    for (var i = 0; i < iLength; i++) {
      this._lRelatedCovers[i].purge();
      this._lRelatedCovers[i] = 0;
    }
    this._lRelatedCovers = null;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
    this._oGlobalDispatcher = null;
    this.purgeRelatedCovers();
    this._$related_deck.remove();
    this._$related_deck = null;
  }

});