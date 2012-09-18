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
  _isEditable : null,
  _wGetVisitItems : null,
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
    this._isEditable = false;
    // this.initGetVisitItemsWorker();
    this.getVisits();
  },

  /**
   * Return the DOM value.
   *
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$sticker;
  },

  /**
   * display the sticker.
   */
  display : function() {
    var self = this;

    var $sticker = this._$sticker = $('<div class="ct-stickyBar_sticker">');

    var lVisitItems = this._oStory.visitItems();
    // var oLastVisitItem = _.last(lVisitItems);
    // this._oStory.computeTitle();
    // this._oStory.computeFeaturedImage();
    var $title = $('<h3>').text(this._oStory.title());

    // var oExtractedDna = oLastVisitItem.extractedDNA();

    this._$img = $('<img src="/media/images/default_preview7.png" />');
    if (this._oStory._sFeaturedImage !== "") {
      this._$img.attr("src", this._oStory._sFeaturedImage);
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
      if (Cotton.Config.Parameters.bActiveSumup === true){
        self.openSumUp();
      }
    }, function() {
      // Out
      if (Cotton.Config.Parameters.bActiveSumup  === true){
        self.closeSumUp();
      }
    });

    $sticker.click(function() {
      self.openStory();
      // event tracking
      Cotton.ANALYTICS.enterStory();
    });

    this._oBar.append($sticker);

  },

  /**
   * Translate the sticker after the user scroll the sticky_bar
   *
   * @param {int}
   *          iTranslateX : value of the translation
   * @param {boolean}
   *          [bDoNotAnimate] : UNUSED
   * @param {int}
   *          [iElastic] : value of an elastic effect when you scroll to much.
   */
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

  /**
   * Open the preview of the story
   *
   * DISABLE
   */
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

  /**
   * Close the preview of the story.
   *
   * DISABLE
   */
  closeSumUp : function() {
    $('.ct-sumUp').css('top', '100px');
    var $sumUpUl = $('.ct-sumUp ul');
    $sumUpUl.remove();
  },

  /**
   * Draw each visitItem in the story using the information on self._oStory.
   *
   * @param {Array.
   *          <Cotton.Model.VisitItem>} lVisitItems
   */
  drawStory : function(lVisitItems){
    var self = this;
    var oStoryline = new Cotton.UI.Story.Storyline(self._oStory);
    self._oBar.close();
  },

  /*
   * Called when a stcker is cliked.
   */
  openStory : function() {
    var self = this;
    this.closeSumUp();
    Cotton.UI.Home.HOMEPAGE.hide();
    // TODO(rmoutard) : use a worker to get that.
    // If the story is empty make a dbRequest to get the corresponding
    // visitItems.
    if(self._oStory.visitItems().length === 0){
      console.debug('ct - visitItems not loaded');
      new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
        this.findGroup('visitItems', 'id', self._oStory.visitItemsId(),
          function(lVisitItems) {
          console.debug("ct - visitItems has been loaded in the database");
          self._oStory.setVisitItems(lVisitItems);
          self.drawStory(lVisitItems);
          });
      });
    } else {
      console.debug("ct - visitItems already loaded");
      console.debug("ct - visitItems corresponding to the clicked story");
      console.debug(self._oStory.visitItems());

      self.drawStory(self._oStory.visitItems());
    }
    // TODO(rmoutard) : avoid to manipulate DOM
    $('.ct-flip').text(self._oStory.title());
  },

  /**
   * Resize the image so it takes the whole place in the div sticker. Call on
   * the load callback function.
   *
   * @param {HtmlElement}
   *          $img
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

  /**
   * editable
   *
   * Add the remove button. On click remove the story on the database, and
   * remove the current sticker.
   */
  editable : function() {
    var self = this;
    if (self._isEditable === false) {
      this._isEditable = true;
      var $removeButton = $("<div class='ct-stickers_removeButton' ></div>");
      $removeButton.click(function() {
        var bClear = confirm(
          "Are you sure you want to delete the story " +
          self._oStory.title() + "?\n" +
          "This story will be permanently removed from cottonTracks.\n" +
          "(elements will remain in your Chrome history)"
        );

        if (bClear) {
          new Cotton.DB.Store('ct', {
            'stories' : Cotton.Translators.STORY_TRANSLATORS,
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
          }, function() {
              for(var i = 0; i < self._oStory.visitItemsId().length; i++){
                var iId = self._oStory.visitItemsId()[i];
                this.delete('visitItems', iId, function(){
                  console.log("delete visitItem");
                });
              }
              this.delete('stories', self._oStory.id(), function() {
                console.log("delete story");
              });
          });

          self.$().remove();
          self.closeSumUp();
          Cotton.UI.Home.HOMEPAGE.show();
          self._oBar.open();

          var lUpperStickers = _.filter(self._oBar._lStickers,
            function(oSticker){
              return oSticker._iPosition > self._iPosition;
          });

          for(var i = 0, oSticker; oSticker = lUpperStickers[i]; i++){
            oSticker._iPosition-=1;
            var iLeft = parseInt(oSticker.$().css('left')) - Cotton.UI.StickyBar.HORIZONTAL_SPACING;
            oSticker.$().css("left", iLeft+"px");
          }
          // event tracking
          Cotton.ANALYTICS.deleteStory();
        }
      });
      self._$sticker.append($removeButton);
    } else {
      this._isEditable = false;
      self._$sticker.find('.ct-stickers_removeButton').remove();
    }
  },

  initGetVisitItemsWorker : function(){
    var self = this;
    self._wGetVisitItems = new Worker("ui/sticky_bar/w_get_visit_items.js");

    self._wGetVisitItems.addEventListener('message', function(e) {
      var lVisitItemsSerialized = e.data;
      var lVisitItems = [];
      for(var i = 0, dVisitItem; dVisitItem = lVisitItemsSerialized[i]; i++){
        var oVisitItem = new Cotton.Model.VisitItem();
        oVisitItem.deserialize(dVisitItem);
        lVisitItems.push(oVisitItem);
      }
      self._oStory.setVisitItems(lVisitItems);
      console.debug("stickers - loading finished");
      console.debug(lVisitItems);
    });
    self._wGetVisitItems.postMessage(self._oStory.visitItemsId());

  },

  getVisits : function(){
    var self = this;
    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      oStore.findGroup('visitItems', 'id', self._oStory.visitItemsId(), function(lVisitItems) {
        self._oStory.setVisitItems(lVisitItems);
      });
    });
  },
});

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
