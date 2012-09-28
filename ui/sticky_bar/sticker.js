'use strict';

Cotton.UI.StickyBar.HORIZONTAL_SPACING = 250;

/**
 * Sticker
 * Each sticker corresponds to a story. They are display in the sticky_bar.
 *
 * on click : the correponding story is oppened in the story line.
 * on hover : the editable button appear.
 * draggable : drag an sticker in another sticker will merge both stories.
 * droppable :
 */
Cotton.UI.StickyBar.Sticker = Class.extend({

  _oBar : null,

  _$sticker : null,

  /**
   * {int} its position in the list of stickers.
   */
  _iPosition : null,

  /**
   * {Cotton.Model.Story} data of the sticker.
   */
  _oStory : null,

  // DOM - sub elements
  _$editable_button : null,
  _$img : null,
  _$title : null,

  // Parameters
  _isEditable : false,

  /**
   * {int} position without translation.
   */
  _iOriginalPosition : 0,

  /**
   * {int} position with translation.
   */
  _iCurrentPosition : 0,

  /**
   * @constructor
   *
   * @param oBar
   * @param iPosition
   * @param oStory
   */
  init : function(oBar, iPosition, oStory) {

    this._oBar = oBar;
    this._iPosition = iPosition;
    this._oStory = oStory;

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
   * Display the sticker.
   * Handle the UI, and bind to every events.
   */
  display : function() {
    var self = this;

    var $sticker = self._$sticker = $('<div class="ct-stickyBar_sticker">');

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
      } else if($(this).is('.ui-draggable-dragging')) {
        // Do not open if we click on the editable.
        return;
      }
      self.openStory();
      // event tracking
      Cotton.ANALYTICS.enterStory();
    });


    // _REMOVE.
    $sticker.bind({'_remove': function(event){
        self._remove();
      }
    });

    // _MERGE.
    $sticker.bind({'_merge': function(event, ui, iSubStoryId){
        self._merge(ui, iSubStoryId);
      }
    });

    // DRAGGABLE
    $sticker.draggable({
        'revert': function (event, ui) {
            // Return to original position if not drop on droppable element.
            $(this).data("draggable").originalPosition = {
              'top' : 0,
              'left': self._iCurrentPosition,
            };
            return !event;
        }
    });

    $sticker.qtip({
      'content' : 'Drop it to merge both stories',
      'position' : {
        'my' : 'top center',
        'at' : 'bottom center'
      },
      'show' : '',
      'hide' : '',
      'style' : {
        'tip' : true,
        'classes' : 'ui-tooltip-yellow'
      }
    });

    // DROPPABLE
    $sticker.droppable({
      'drop': function(event, ui){
        // Merge stories.
        ui.draggable.trigger('_merge', [ui, self._oStory.id()]);
      },
      // Add class to the drop container.
      'hoverClass': "drophover",
      // Add class to the drag element.
      'over': function(event, ui){
        ui.draggable.addClass("can_be_dropped");
        $sticker.qtip('show');
      },
      'out': function(event, ui){
        ui.draggable.removeClass("can_be_dropped");
        $sticker.qtip('hide');
      },
    });

    // CONTENT
    var lVisitItems = self._oStory.visitItems();
    var $title = $('<h3>').text(self._oStory.title());

    this._$img = $('<img src="/media/images/default_preview7.png" />');
    if (this._oStory._sFeaturedImage !== "") {
      this._$img.attr("src", self._oStory._sFeaturedImage);
    }

    // Load is a callback function, called when the image is ready.
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
    var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;

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
   * Check that visitItems id correctly load, if not load it. Then call
   * draw story, to create the storyline.
   *
   * Bind on event : "click"
   */
  openStory : function() {
    var self = this;

    this.closeSumUp();
    Cotton.UI.Home.HOMEPAGE.hide();

    // If the story is empty make a request to get corresponding visitItems.
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
      // portrait
      $img.width(iDivW);
    } else {
      // landscape
      $img.height(iDivH);
    }
  },

  /**
   * Make a db request to get corresponding visitItems.
   * Called when the sticker is initialized.
   */
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
   *
   * Bind to event : "_remove"
   */
  _remove : function(){
    var self = this;

    // Remove DOM element.
    self.$().remove();
    self.closeSumUp();
    // if the current story is open in the story line show homepage.
    if(_oCurrentlyOpenStoryline && self._oStory.id() === _oCurrentlyOpenStoryline.story().id()){
      Cotton.UI.Home.HOMEPAGE.show();
      self._oBar.open();
    }
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
      oSticker._iOriginalPosition -=  Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      var iLeft = self._iFinalPosition = parseInt(oSticker.$().css('left')) - Cotton.UI.StickyBar.HORIZONTAL_SPACING;
      oSticker.$().css("left", iLeft+"px");
    });

  },

  /**
   * Merge the given story to the self one.
   *
   * Bind on event : "_merge"
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
   *
   * Bind to event : "$editable_button.click"
   */
    makeItEditable : function(){
      var self = this;

      if (self._isEditable === false) {
        self._isEditable = true;

        var $remove_button = $('<div class="ct-stickers_button_remove"></div>');

        // Bind mouseup.
        $remove_button.mouseup(function() {
          // Ask confirmation.
          var bClear = confirm(
            "Are you sure you want to delete the story " +
            self._oStory.title() + "?\n" +
            "This story will be permanently removed from cottonTracks.\n" +
            "(elements will remain in your Chrome history)"
          );

          if (bClear) {
            // Remove DOM element.
            self._remove();
            // Call the controller to remove story in the database.
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
