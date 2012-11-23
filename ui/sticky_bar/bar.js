'use strict';
/**
 * Cotton.UI.StickyBar
 *
 * Represents the bar displayed in the middle of the screen, containing stickers
 * for each story.
 */
Cotton.UI.StickyBar.Bar = Class.extend({

  /**
   * Cotton.Model.World : parent element.
   */
  _oWorld : null,

  _lStickers : null,
  _$stickyBar : null,
  _$container : null,
  _oCommands : null,
  _$commands : null,
  _$sumUp : null,
  _iTranslateX : 0,
  _bLoading : false,

  /**
   * @constructor
   */
  init : function(oWorld) {
    var self = this;

    self._oWorld = oWorld;

    this._lStickers = [];
    this._$stickyBar = $('#ct-stickyBar_bar');
    this._$container = $('.ct-container');

    //this._oCommands = new Cotton.UI.StickyBar.Commands(self);
    this._$commands = $('.ct-commands');
    this._iTranslateX = 0;
    this._bLoading = false;

    this._$sumUp = $('#ct-sumUp');

    var bScrolled = false;

    // CLICK - On arrow left
    this._$stickyBar.find('.ct-arrow_left').click(function() {
      // TODO(fwouts): Use constants.

      var iDelta = 250;
      var iPosition = self._iTranslateX + iDelta;
      // position = (1-|K/L|)*(L-K/2)*H + M + M'
      var K = 10 // self._lStickers.length initial
      var H = Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      var M1 = 100;
      var M2 = 100;
      var p = (2 * self.$().width()) / 3;
      // var iPositionMax = (1 - Math.floor(K / self._lStickers.length))
      // * (self._lStickers.length - K / 2) * H + M1;
      var iPositionMax = (self._lStickers.length * H) - p + M1;
      // TODO(rmoutard) : use constants
      if (iPosition > 580.0) {
        iPosition = 580;
      } else if (iPosition < -(iPositionMax + M2)) {
        // Stop the scroll.
        iPosition = -(iPositionMax + M2);
      } else if (iPosition < -(iPositionMax)) {
        // Update the stickers bar.
        if (self._bLoading === false) {
          self._bLoading = true;
          self.getMoreStories();
        }

      }

      self.translateStickers(iPosition);

      // Event Tracker on first scroll
      if (bScrolled == false) {
        bScrolled = true;
        Cotton.ANALYTICS.scrollWithLeftArrow();
      }
    });

    // CLICK - On arrow right
    this._$stickyBar.find('.ct-arrow_right').click(function() {
      // TODO(fwouts): Use constants.

      var iDelta = -250;
      var iPosition = self._iTranslateX + iDelta;
      // position = (1-|K/L|)*(L-K/2)*H + M + M'
      var K = 10 // self._lStickers.length initial
      var H = Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      var M1 = 100;
      var M2 = 100;
      var p = (2 * self.$().width()) / 3;
      // var iPositionMax = (1 - Math.floor(K / self._lStickers.length))
      // * (self._lStickers.length - K / 2) * H + M1;
      var iPositionMax = (self._lStickers.length * H) - p + M1;
      // TODO(rmoutard) : use constants
      if (iPosition > 580.0) {
        iPosition = 580;
      } else if (iPosition < -(iPositionMax + M2)) {
        // Stop the scroll.
        iPosition = -(iPositionMax + M2);
      } else if (iPosition < -(iPositionMax)) {
        // Update the stickers bar.
        if (self._bLoading === false) {
          self._bLoading = true;
          self.getMoreStories();
        }

      }

      self.translateStickers(iPosition);

      // Event Tracker on first scroll
      if (bScrolled == false) {
        bScrolled = true;
        Cotton.ANALYTICS.scrollWithRightArrow();
      }
    });

    // MOUSEWHEEL
    $(window).bind('mousewheel', function(oEvent) {

      // OPEN
      // do not call open() method if scrolled in container
      if($(this).scrollTop() === 0 && oEvent['originalEvent']['wheelDeltaY'] > 0
          && !$(oEvent.target).parents().is('.ct-container')
          && !$(oEvent.target).is('.ct-container')){
        self.open();
      }
      // CLOSE
      // do not close if scrolled in container
      else if($(this).scrollTop() === 0 && oEvent['originalEvent']['wheelDeltaY'] < 0
          && !$(oEvent.target).parents().is('.ct-container')
          && !$(oEvent.target).is('.ct-container')){
        self.close();
      }
      // Scroll in Story Selector
      else if ($(oEvent.target).parents().is('.ct-container')
          || $(oEvent.target).is('.ct-container')){
        // TODO(fwouts): Use constants.
        if (oEvent['originalEvent']['wheelDeltaX'] === 0) {
          var iDelta = oEvent['originalEvent']['wheelDeltaY'] * 0.5;
        } else {
          var iDelta = oEvent['originalEvent']['wheelDeltaX'] * 0.5;
        }
        var iPosition = self._iTranslateX + iDelta;
        // position = (1-|K/L|)*(L-K/2)*H + M + M'
        var K = 10 // self._lStickers.length initial
        var H = Cotton.UI.StickyBar.HORIZONTAL_SPACING;
        var M1 = 100;
        var M2 = 100;
        var p = (2 * self.$().width()) / 3;
        // var iPositionMax = (1 - Math.floor(K / self._lStickers.length))
        // * (self._lStickers.length - K / 2) * H + M1;
        var iPositionMax = (self._lStickers.length * H) - p + M1;
        if (iPosition > 580.0) {
          iPosition = 580;
        } else if (iPosition < -(iPositionMax + M2)) {
          // Stop the scroll.
          iPosition = -(iPositionMax + M2);
        } else if (iPosition < -(iPositionMax)) {
          // Update the stickers bar.
          if (self._bLoading === false) {
            self._bLoading = true;
            self.getMoreStories();
          }
        }

        self.translateStickers(iPosition, true);
        oEvent.preventDefault();

        // Event Tracker on first scroll
        if (bScrolled == false) {
          bScrolled = true;
          Cotton.ANALYTICS.scrollStorySelector();
        }
      }
    });

    /*
    this._$stickyBar.animate({
      top : '0px'
    }, 'slow', function() {
      self._$stickyBar.css('top', '');
      self.trigger('ready');
    });

    Cotton.UI.World.COMMUNICATOR.on('story_element', function(oStoryElement) {
      // pass
    });
    */
  },

  /*
   * Returns the jQuery element.
   *
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$stickyBar;
  },

  /**
   * Creates a new sticker and adds it to the bar.
   *
   * @param {Cotton.Model.Story}
   *          oStory
   * @return {Cotton.UI.StickyBar.Sticker}
   */
  buildSticker : function(oStory) {
    // Each sticker will have a different position.
    var iPosition = this._lStickers.length;
    var oSticker = new Cotton.UI.StickyBar.Sticker(this, iPosition, oStory);
    this._lStickers.push(oSticker);
    return oSticker;
  },

  /**
   * Return the number of stickers
   *
   * @return {int}
   */
  stickerCount : function() {
    return this._lStickers.length;
  },

  /**
   * Append a sticker to the stickyBar
   *
   * @param {HtmlElement}
   *          $sticker
   */
  append : function($sticker) {
    // Note that we append the element to the .container, not directly to
    // the sticky bar.
    // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
    this._$stickyBar.find('> .ct-container').append($sticker);
  },

  /**
   * Translate all the stickers. Plug to mouseWheel.
   *
   * @param {int}
   *          iTranslateX : value of the translation.
   * @param {boolean}
   *          [bDoNotAnimate] : UNUSED
   */
  translateStickers : function(iTranslateX, bDoNotAnimate) {
    bDoNotAnimate = bDoNotAnimate || false;
    this._iTranslateX = iTranslateX;
    _.each(this._lStickers, function(oSticker) {
      oSticker.translate(iTranslateX, bDoNotAnimate);
    });
  },

  /**
   * Open the sticky bar.
   */
  open : function() {
    // Scroll to top of story before opening topbar
 	var self = this;
 	var scrollTime = Math.min(Math.sqrt(Math.abs($(window).scrollTop()))*20,1000);
    $('html,body').animate({scrollTop:0},scrollTime, function(){
      self._$stickyBar.removeClass('close');
      $('#ct-story_homepage').removeClass('close');
    });
  },

  /**
   * Close the sticky bar
   */
  close : function() {
  	// Do not allow closing topbar on home and search
    if ($('.ct-homepage').css('display') != 'block'
        && $('.ct-searchpage').css('display') != 'block'){
      this._$stickyBar.addClass('close');
      $('#ct-story_homepage').addClass('close');
    }
  },

  /**
   * Switch between open and close. Plug to flip-button.
   */
  openClose : function() {
    if (this._$stickyBar.hasClass('close')) {
      this.open();
    } else {
      this.close();
    }
  },

  /**
   * Make a DbRequest to get the following stories and display more stickers.
   */
  getMoreStories : function() {
    var self = this;

    var iStart = self._lStickers.length + 1;
    Cotton.DB.Stories.getRange(iStart, iStart + 10, function(lStories) {
      // Various initializers, mostly for testing.
      var lStickers = [];
      _.each(lStories, function(oStory) {
        var oSticker = self.buildSticker(oStory);
        oSticker.display();
      });
      self._bLoading = false;
    });
  },

  /**
   * From stories create corresponding stickers, and add them at the end of
   * the sticky_bar.
   *
   * @param {Array.<Cotton.Model.Story>} lStories
   */
  pushStories : function(lStories) {
    var self = this;
    var lStickers = [];
    _.each(lStories, function(oStory) {
      var oSticker = self.buildSticker(oStory);
      lStickers.push(oSticker);
    });

    _.each(lStickers, function(oSticker) {
      oSticker.display();
    });

  },

  /**
   * From stories create corresponding stickers, and add them at the
   * beginning of the sticky_bar.
   *
   * @param {Array.<Cotton.Model.Story>} lStories
   */
  appendStories : function(lStories) {
    var self = this;
    var lStickers = [];
    _.each(lStories, function(oStory) {
      var oSticker = self.buildSticker(oStory);
      lStickers.push(oSticker);
    });

    _.each(lStickers, function(oSticker) {
      oSticker.display();
    });

  },

  /**
   * Remove the sticker from the UI.
   *
   * @param {Cotton.UI.StickyBar.Sticker} oSticker
   */
  removeSticker : function(iId){
    var self = this;
    // remove the DOM element.
    var oSticker = _.find(self._lStickers, function(oSticker){
      return oSticker._oStory.id() === iId;
    });
    oSticker._remove();
    // remove lStickers.
    self._lStickers = _.reject(self._lStickers, function(oSticker){
      return oSticker._oStory.id() === iId;
    });

  },

  /**
   * Remove all stickers.
   *
   * For some unknown reasons this is really, really slow !!
   * Don't use it !
   */
  removeAllStickers : function(){
    var self = this;
/*    _.each(self._lStickers, function(oSticker){
        oSticker.$().remove();
    });
*/
    self._$container.empty();
    self._lStickers = [];
    self._iTranslateX = 0;
  },

  /**
   * Show all the results from a search.
   *
   * @param {Array.<Cotton.Model.Story>} lStories
   */
  showResultFromSearch : function(lStories){
    var self = this;
    var iStickerIndex = 0;
    _.each(self._lStickers, function(oSticker){
      if(iStickerIndex < lStories.length){
        oSticker.recycle(lStories[iStickerIndex]);
      } else {
        oSticker.$().hide();
      }
      iStickerIndex += 1;
    });

    // Handle the case where there are more results than stickers. We need to
    // create new stickers to receive stories.
    if(iStickerIndex < lStories.length){
      self.pushStories(lStories.slice(iStickerIndex));
    }

    // reset the position to 0.
    self.translateStickers(0);
  },

  /**
   * Reset Search
   */
  resetSearch : function(lStories){
    var self = this;
    var iStickerIndex = 0;
    // TODO(rmoutard) : problem if there amre more results than stickers !
    // I think there will be always the right number.
    _.each(self._lStickers, function(oSticker){
      if(iStickerIndex < lStories.length){
        oSticker.recycle(lStories[iStickerIndex]);
      } else {
        oSticker.$().show();
      }
      iStickerIndex += 1;
    });
  },

});

//_.extend(Cotton.UI.StickyBar.Bar.prototype, Backbone.Events);
