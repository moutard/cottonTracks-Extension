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
        for ( var i = 0, oVisitItem; oVisitItem = this._oStory.visitItems()[i]; i++) {
          $sumUpUl.append('<li>' + oVisitItem.title() + '</li>');
        }
        $sumUp.css('height', '110px');
      },

      closeSumUp : function() {
        $('.ct-sumUp').css('height', '0px');
        var $sumUpUl = $('.ct-sumUp ul');
        $sumUpUl.remove();
      },
    });

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
