'use strict';

Cotton.UI.StickyBar.HORIZONTAL_SPACING = 250;

// Represents a sticker on the sticky bar.
Cotton.UI.StickyBar.Sticker = Class
    .extend({

      _oBar : null,
      _iPosition : null,
      _oStory : null,
      _$sticker : null,

      init : function(oBar, iPosition, oStory) {
        this._oBar = oBar;
        this._iPosition = iPosition;
        this._oStory = oStory;
      },

      display : function() {
        var self = this;

        var $sticker = this._$sticker = $('<div class="ct-stickyBar_sticker">');

        var lVisitItems = this._oStory.visitItems();
        var oLastVisitItem = _.last(lVisitItems);
        this._oStory.computeTitle();
        var $title = $('<h3>').text(this._oStory.title());

        var oExtractedDna = oLastVisitItem.extractedDNA();
        var sImgSrc = null;
        // TODO(fwouts): Implement the mainImage method.
        if (oExtractedDna && oExtractedDna.mainImage) {
          sImgSrc = oExtractedDna.mainImage();
        }
        var $image = $('<img>');
        if (sImgSrc) {
          $image.attr('src', sImgSrc);
        } else {
          // TODO(fwouts): Add a default image. Or pick another visit item with
          // an image.
        }

        $sticker.append($title, $image);

        var iStickerCount = this._oBar.stickerCount();
        var iFinalPosition = (this._iPosition - iStickerCount / 2)
            * Cotton.UI.StickyBar.HORIZONTAL_SPACING + this._oBar.$().width()
            / 2;
        var iDistanceToCenter = this._oBar.$().width() / 2 - iFinalPosition;
        var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;

        $sticker.css({
          left : iInitialPosition
        })

        // TODO(fwouts): Use CSS animations.
        $sticker.animate({
          left : iFinalPosition
        }, 'slow', function() {
          self.trigger('ready');
        });

        $sticker.hover(function() {
          // In
          self.openSumUp();
        }, function() {
          // Out
          self.closeSumUp();
        });

        $sticker.click(function() {
          self.openStory();
        });

        this._oBar.append($sticker);
      },

      translate : function(iTranslateX, bDoNotAnimate) {
        bDoNotAnimate = bDoNotAnimate || false;
        if (bDoNotAnimate) {
          this._$sticker.stop().css({
            marginLeft : iTranslateX
          });
        } else {
          this._$sticker.stop().animate({
            marginLeft : iTranslateX
          });
        }
      },

      openSumUp : function() {
        var $sumUp = $('.ct-sumUp');
        $sumUp.append('<ul></ul>');
        var $sumUpUl = $('.ct-sumUp ul');
        _.each(this._oStory.visitItems(), function(oVisitItem) {
          $sumUpUl.append('<li>' + oVisitItem.title() + '</li>');
        });

        //TODO(rmoutard) : don't put the value in the code.
        $sumUp.css('top', '245px');
      },

      closeSumUp : function() {
        $('.ct-sumUp').css('top', '145px');
        var $sumUpUl = $('.ct-sumUp ul');
        $sumUpUl.remove();
      },

      openStory : function() {
        this.closeSumUp();
        Cotton.UI.Homepage.GRID.hide();

        var oStoryline = new Cotton.UI.Story.Storyline();
        _.each(this._oStory.visitItems(), function(oVisitItem, iI) {
          var oItem = oStoryline.buildStory(oVisitItem);
          // TODO(fwouts): Cleanup.
          oItem.setTop(100 + iI * 75);
          // Since we use -webkit-transition, we just need to modify the CSS
          // after a very short while in order to trigger the animation.
          setTimeout(function() {
            oItem.setTop(270 + iI * 100);
          }, 0);
          oItem.setSide(iI % 2 == 0 ? 'left' : 'right');
        });
      }
    });

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
