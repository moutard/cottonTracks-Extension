'use strict';

// Represents the bar displayed in the middle of the screen, containing stickers
// for each story.
Cotton.UI.StickyBar.Bar = Class.extend({

  _lStickers : null,
  _$stickyBar : null,
  _oCommands : null,
  _$commands : null,
  _$sumUp : null,
  _iTranslateX : 0,
  _bLoading : false,

  init : function() {
    var self = this;
    this._lStickers = [];
    this._$stickyBar = $('#ct-stickyBar_bar');

    this._oCommands = new Cotton.UI.StickyBar.Commands(self);
    this._$commands = $('.ct-commands');
    this._iTranslateX = 0;
    this._bLoading = false;

    this._$sumUp = $('#ct-sumUp');

    var bScrolled = false;

    this._$stickyBar.find('.ct-arrow_left').click(
        function() {
          // TODO(fwouts): Use constants.
          self.translateStickers(self._iTranslateX + 250);
          if (bScrolled == false) {
            bScrolled = true;
            // Event Tracking
            _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
                'Left arrow in story selector' ]);
          }
        });

    this._$stickyBar.find('.ct-arrow_right').click(
        function() {
          // TODO(fwouts): Use constants.
          self.translateStickers(self._iTranslateX - 250);
          if (bScrolled == false) {
            bScrolled = true;
            // Event Tracking
            _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
                'Right arrow in story selector' ]);
          }
        });

    this._$stickyBar.find('.ct-container').bind(
        'mousewheel',
        function(oEvent) {
          // TODO(fwouts): Use constants.
          var iDelta = oEvent['originalEvent']['wheelDeltaX'] * 0.5;
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
            _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
                'Scroll in story selector' ]);
            // bTranslated = true;
          }
        });

    this._$stickyBar.animate({
      top : '0px'
    }, 'slow', function() {
      self._$stickyBar.css('top', '');
      self.trigger('ready');
    });

    Cotton.UI.World.COMMUNICATOR.on('story_element', function(oStoryElement) {
      // console.log(oStoryElement.url);
    });
  },

  // Returns the jQuery element.
  $ : function() {
    return this._$stickyBar;
  },

  // Creates a new sticker and adds it to the bar.
  buildSticker : function(oStory) {
    // Each sticker will have a different position.
    var iPosition = this._lStickers.length;
    var oSticker = new Cotton.UI.StickyBar.Sticker(this, iPosition, oStory);
    this._lStickers.push(oSticker);
    return oSticker;
  },

  stickerCount : function() {
    return this._lStickers.length;
  },

  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append : function($sticker) {
    // Note that we append the element to the .container, not directly to
    // the sticky bar.
    this._$stickyBar.find('> .ct-container').append($sticker);
  },

  translateStickers : function(iTranslateX, bDoNotAnimate) {
    bDoNotAnimate = bDoNotAnimate || false;
    this._iTranslateX = iTranslateX;
    _.each(this._lStickers, function(oSticker) {
      oSticker.translate(iTranslateX, bDoNotAnimate);
    });
  },

  open : function() {
    this._$stickyBar.removeClass('close');
    $('#ct-story-homepage').removeClass('close');
  },
  close : function() {
    this._$stickyBar.addClass('close');
    $('#ct-story-homepage').addClass('close');
  },
  openClose : function() {
    if (this._$stickyBar.hasClass('close')) {
      this.open();
    } else {
      this.close();
    }
  },

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
      /*
       * _.each(lStickers, function(oSticker) { oSticker.display(); });
       */
      self._bLoading = false;
    });
  },

});

_.extend(Cotton.UI.StickyBar.Bar.prototype, Backbone.Events);
