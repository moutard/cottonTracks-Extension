'use strict';

// Represents the bar displayed in the middle of the screen, containing stickers
// for each story.
Cotton.UI.StickyBar.Bar = Class
    .extend({

      _lStickers : null,
      _$stickyBar : null,
      _$commands : null,
      _$sumUp : null,
      _iTranslateX : 0,

      init : function() {
        var self = this;
        this._lStickers = [];
        this._$stickyBar = $('#ct-stickyBar_bar');
        this._$commands = $('.ct-commands');
        this._iTranslateX = 0;

        this._$sumUp = $('#ct-sumUp');

        this._$stickyBar.find('.ct-arrow_left').click(function() {
          // TODO(fwouts): Use constants.
          self.translateStickers(self._iTranslateX + 250);
        });

        this._$stickyBar.find('.ct-arrow_right').click(function() {
          // TODO(fwouts): Use constants.
          self.translateStickers(self._iTranslateX - 250);
        });

        this._$stickyBar
            .find('.ct-container')
            .bind(
                'mousewheel',
                function(oEvent) {
                  // TODO(fwouts): Use constants.
                  var iDelta = oEvent.originalEvent.wheelDeltaX * 0.5;
                  var iPosition = self._iTranslateX + iDelta;
                  if (iPosition > 580.0) {
                    iPosition = 580;
                  } else if (iPosition < -(self._lStickers.length * Cotton.UI.StickyBar.HORIZONTAL_SPACING) / 2) {
                    // iPosition = Cotton.UI.StickyBar.HORIZONTAL_SPACING * 30;
                    self.getMoreStories();
                  }

                  self.translateStickers(iPosition, true);
                  oEvent.preventDefault();
                });

        $('.ct-flip').click(function() {
          self.openClose();
        });

        this._$stickyBar.animate({
          top : '0px'
        }, 'slow', function() {
          self._$stickyBar.css('top', '');
          self.trigger('ready');
        });

        Cotton.UI.World.COMMUNICATOR.on('story_element',
            function(oStoryElement) {
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
        // the
        // sticky bar.
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
        Cotton.DBSCAN2.getXStories(10, function(lStories) {
          // Various initializers, mostly for testing.
          var lStickers = [];
          _.each(lStories, function(oStory) {
            var oSticker = self.buildSticker(oStory);
            lStickers.push(oSticker);
          });

          _.each(lStickers, function(oSticker) {
            oSticker.display();
          });
        });
      },
    });

_.extend(Cotton.UI.StickyBar.Bar.prototype, Backbone.Events);
