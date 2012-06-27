'use strict';

Cotton.UI.StickyBar.HORIZONTAL_SPACING = 250;

/**
 * @class Represent a sticker
 */
Cotton.UI.StickyBar.Sticker = Class.extend({

  // TODO(rmoutard) : try to refactor to remove rmoutard.
  _oBar : null,
  _iPosition : null,
  _oStory : null,
  _$sticker : null,
  _$img : null,

  /**
   * @constructor
   * @param oBar
   * @param iPosition
   * @param oStory
   */
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
    this._oStory.computeFeaturedImage();
    var $title = $('<h3>').text(this._oStory.title());

    var oExtractedDna = oLastVisitItem.extractedDNA();
    var sImgSrc = null;
    // TODO(fwouts): Implement the mainImage method.
    if (oExtractedDna && oExtractedDna.mainImage) {
      sImgSrc = oExtractedDna.mainImage();
    }

    this._$img = $('<img src="images/default_preview7.png" />');
    if (this._oStory._sFeaturedImage !== "") {
      this._$img.attr("src", this._oStory._sFeaturedImage);
    }

    if (sImgSrc) {
      this._$img.attr('src', sImgSrc);
    } else {
      // TODO(fwouts): Add a default image. Or pick another visit item with
      // an image.
    }

    /**
     * load is a callback function, called when the image is ready.
     */
    this._$img.load(function() {
      self.resizeImg($(this));
    });

    $sticker.append($title, this._$img);

    var iStickerCount = this._oBar.stickerCount();
    var iFinalPosition = (this._iPosition)
        * Cotton.UI.StickyBar.HORIZONTAL_SPACING + 20;
    var iDistanceToCenter = this._oBar.$().width() / 2 - iFinalPosition;
    if (iStickerCount === 10) {
      var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;
    } else {
      var iInitialPosition = iFinalPosition;
    }

    $sticker.css({
      left : iInitialPosition
    })
    $sticker.css({
      'margin-left' : this._oBar._iTranslateX
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

  translate : function(iTranslateX, bDoNotAnimate, iElastic) {
    iElastic = iElastic || 0;
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

    // TODO(rmoutard) : don't put the value in the code.
    $sumUp.css('top', '200px');
  },

  closeSumUp : function() {
    $('.ct-sumUp').css('top', '100px');
    var $sumUpUl = $('.ct-sumUp ul');
    $sumUpUl.remove();
  },

  openStory : function() {
    var self = this;
    this.closeSumUp();
    Cotton.UI.Homepage.HOMEPAGE.hide();

    var oStoryline = new Cotton.UI.Story.Storyline();
    _.each(this._oStory.visitItems(), function(oVisitItem, iI) {
      var oItem = oStoryline.addVisitItem(oVisitItem, iI % 2 == 0 ? 'left'
          : 'right');
      // var oItem = oStoryline.buildStory(oVisitItem);
      // TODO(fwouts): Cleanup.
      // oItem.setTop(20);
      // Since we use -webkit-transition, we just need to modify the CSS
      // after a very short while in order to trigger the animation.
      // var iItemHeight = 100;
      // var iItemMargin = 20;
      setTimeout(function() {
        oItem.$().css("opacity", "1");
        // oItem.setTop(iItemMargin + iI * iItemHeight);
      }, iI * 100);
      // oItem.setSide(iI % 2 == 0 ? 'left' : 'right');
    });

    /**
     * Close the sticky_bar
     */
    this._oBar.close();

    // TODO(rmoutard) : avoid to manipulate DOM
    $('.ct-flip').text(self._oStory.title());
  },

  /**
   * Resize the image so it takes the whole place in the div sticker. Call on
   * the load callback function.
   *
   * @param $img
   */
  resizeImg : function($img) {
    var iH = $img.height();
    var iW = $img.width();
    var fRatio = iW / iH;

    // get div dimensions
    var iDivH = 120;
    var iDivW = 200;
    var fDivRatio = iDivW / iDivH;

    if (fDivRatio > fRatio) {
      /** portrait */
      $img.width(iDivW);
      // this._$('img').css('top', Math.round((div_h - h) / 2) + 'px');
    } else {
      /** landscape */
      $img.height(iDivH);
      // this._$('img').css('margin-left', Math.round(w / 2) + 'px');
    }
  },
});

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
