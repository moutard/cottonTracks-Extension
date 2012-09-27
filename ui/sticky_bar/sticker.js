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

  _$editable_button : null,

  _$sticker : null,
  _$img : null,
  _isEditable : null,
  _wGetVisitItems : null,
  _iOriginalPosition : 0,
  _iCurrentPosition : 0,

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

    // Bind remove.
    $sticker.bind({'_remove': function(event){
        self._remove();
      }
    });
    // Bind merge.
    $sticker.bind({'_merge': function(event, ui, iSubStoryId){
        self._merge(ui, iSubStoryId);
      }
    });

    // DRAGGABLE
    $sticker.draggable({
        revert: function (event, ui) {
            // overwrite original position
            $(this).data("draggable").originalPosition = {
              top : 0,
              left: self._iCurrentPosition,
            };
            return !event;
        }
    });

    // DROPPABLE
    $sticker.droppable({
      drop: function(event, ui){
        // merge stories
        ui.draggable.trigger('_merge', [ui, self._oStory.id()]);
      },
      // Add class to the drop container.
      hoverClass: "drophover",
      // Add class to the drag element.
      over: function(event, ui){
        ui.draggable.addClass("can_be_dropped");
      },
      out: function(event, ui){
        ui.draggable.removeClass("can_be_dropped");
      },
    });

    // CONTENT
    var lVisitItems = this._oStory.visitItems();
    var $title = $('<h3>').text(this._oStory.title());

    this._$img = $('<img src="/media/images/default_preview7.png" />');
    if (this._oStory._sFeaturedImage !== "") {
      this._$img.attr("src", this._oStory._sFeaturedImage);
    }

    // load is a callback function, called when the image is ready.
    this._$img.load(function() {
      self.resizeImg($(this));
    });

    // Create editable button.
    this._$editable_button = $('<div class="ct-stickers_button_editable"></div>').hide();
    this._$editable_button.mouseup(function(){
      self.makeItEditable();
    });

    // Create element.
    $sticker.append($title, this._$img, this._$editable_button);

    // Set the position.
    var iStickerCount = this._oBar.stickerCount();
    var iFinalPosition = self._iCurrentPosition = self._iOriginalPosition = (this._iPosition)
        * Cotton.UI.StickyBar.HORIZONTAL_SPACING + 20;
    var iDistanceToCenter = this._oBar.$().width() / 2 - iFinalPosition;
    if (iStickerCount === 10) {
      var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;
    } else {
      var iInitialPosition = iFinalPosition;
    }

    $sticker.css({
      position : "absolute",
      left : iInitialPosition
    })
    $sticker.css({
      'left' : iFinalPosition + this._oBar._iTranslateX
    })

    $sticker.animate({
      left : iFinalPosition
    }, 'slow', function() {
      self.trigger('ready');
    });

    // HOVER
    $sticker.hover(function() {
      // Display Sumup.
      if (Cotton.Config.Parameters.bActiveSumup === true){
        self.openSumUp();
      }
      // Display editable button.
      self._$editable_button.show();

    }, function() {
      // Hide Sumup.
      if (Cotton.Config.Parameters.bActiveSumup  === true){
        self.closeSumUp();
      }
      // Hide editable button.
      self._$editable_button.hide();
    });

    // CLICK
    $sticker.click(function(e) {
      if($(e.target).is('.ct-stickers_button_editable')){
        // Do not open if we click on the editable.
        e.preventDefault();
        return;
      }
      self.openStory(); // event tracking
      Cotton.ANALYTICS.enterStory();
    });

    // Create elements.
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
    var self = this;
    iElastic = iElastic || 0;
    bDoNotAnimate = bDoNotAnimate || false;
    self._iCurrentPosition = self._iOriginalPosition + iTranslateX;

    if (bDoNotAnimate) {
      this._$sticker.stop().css({
        left : self._iCurrentPosition
      });
    } else {
      this._$sticker.stop().animate({
        left : self._iCurrentPosition
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

  /**
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

  /**
   * Remove the stickers and the corresponding story.
   */
  _remove : function(){
    var self = this;

    // Remove DOM element.
    self.$().remove();
    self.closeSumUp();
    Cotton.UI.Home.HOMEPAGE.show();
    self._oBar.open();

    // Get all stickers on the left.
    var lUpperStickers = _.filter(self._oBar._lStickers,
      function(oSticker){
        return oSticker._iPosition > self._iPosition;
    });

    // Remove from bar the current stickers.
    self._oBar._lStickers = _.reject(self._oBar._lStickers, function(oSticker){
      return oSticker._iPosition === self._iPosition;
    });

    // Set position of upper stickers to move forward them to dig the hole.
    _.each(lUpperStickers, function(oSticker){
      oSticker._iPosition-=1;
      self._iOriginalPosition -=  Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      var iLeft = self._iFinalPosition = parseInt(oSticker.$().css('left')) - Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      oSticker.$().css("left", iLeft+"px");
    });

  },

  /**
   * Merge the given story to the self one.
   *
   * @param {int}
   *          iSubStoryId : id of the story to merge with the self one.
   */
  _merge : function(ui, iSubStoryId){
    var self = this;
    var iMainStoryId = self._oStory.id();
    Cotton.CONTROLLER.mergeStoryInOtherStory(iMainStoryId, iSubStoryId, function(){
      ui.draggable.trigger("_remove");
    });

  },

  /**
   * Make the stickers completely editable. Including image, title, and remove
   * button.
   */
    makeItEditable : function(){
      var self = this;

      if (self._isEditable === false) {
        self._isEditable = true;
        var $remove_button = $('<div class="ct-stickers_button_remove"></div>');
        $remove_button.mouseup(function() {
          var bClear = confirm(
            "Are you sure you want to delete the story " +
            self._oStory.title() + "?\n" +
            "This story will be permanently removed from cottonTracks.\n" +
            "(elements will remain in your Chrome history)"
          );

          if (bClear) {
            self._remove();
            Cotton.CONTROLLER.deleteStoryAndVisitItems(self._oStory.id());
          }
        });

        self._$sticker.append($remove_button);
      } else {
        self._isEditable = false;
        self._$sticker.find('.ct-stickers_button_remove').remove();
      }
    },
});

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
