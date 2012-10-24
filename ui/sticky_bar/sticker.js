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
  _$input_title : null,

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

    this.getVisits(function(){});
  },

  /**
   * Return the DOM value.
   *
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$sticker;
  },

  story : function(){
    return this._oStory;
  },

  /**
   * Display the sticker.
   * Handle the UI, and bind to every events.
   */
  display : function() {
    var self = this;

    var $sticker = self._$sticker = $('<div class="ct-stickyBar_sticker">');
    $sticker.attr('ct-story_id', self._oStory.id());

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
      if($(e.target).is('.ct-stickers_button_editable')
          || $(e.target).is('.ct-story_editable_title')
          || $(e.target).is('.ct-story_editable_image') ){
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
        if(ui.draggable.hasClass('ct-stickyBar_sticker')){
          self._merge(parseInt(ui.draggable.attr('ct-story_id')));
          ui.draggable.trigger('_remove');
        } else if(ui.draggable.hasClass('ct-story_item')) {
          self._addVisitItem(parseInt(ui.draggable.attr('id')));
          Cotton.CONTROLLER.removeVisitItemInStory(ui.draggable.attr('id'));
          ui.draggable.remove();
        }
        $sticker.qtip('hide');
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
    this._$title = $('<h3>').text(self._oStory.title());

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
    $sticker.append(this._$title, this._$img, this._$editable_button);

    // Set the position.
    var iStickerCount = this._oBar.stickerCount();
    var iFinalPosition = self._iCurrentPosition = self._iOriginalPosition = (this._iPosition)
        * Cotton.UI.StickyBar.HORIZONTAL_SPACING + 20;
    var iDistanceToCenter = this._oBar.$().width() / 2 - iFinalPosition;
    var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;

    $sticker.css({
      'position' : "absolute",
      'left' : iInitialPosition
    })
    $sticker.css({
      //'left' : iFinalPosition + this._oBar._iTranslateX
    })

    $sticker.animate({
      'left' : iFinalPosition + this._oBar._iTranslateX
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
  drawStory : function(lVisitItems, bForceReload){
    var self = this;
    var oStoryline = new Cotton.UI.Story.Storyline(self._oStory, bForceReload);
    self._oBar.close();
  },

  /**
   * Check that visitItems id correctly load, if not load it. Then call
   * draw story, to create the storyline.
   *
   * Bind on event : "click"
   */
  openStory : function(bForceReload) {
    var self = this;

    this.closeSumUp();
    Cotton.UI.Home.HOMEPAGE.hide();
    Cotton.UI.Search.SEARCHPAGE.hide();

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

      self.drawStory(self._oStory.visitItems(), bForceReload);
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
  getVisits : function(mCallBackFunction){
    var self = this;
    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      oStore.findGroup('visitItems', 'id', self._oStory.visitItemsId(), function(lVisitItems) {
        self._oStory.setVisitItems(lVisitItems);
        mCallBackFunction();
      });
    });
  },

  /**
   * Remove the stickers and the corresponding storyline if open.
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
   *          iMainStoryId : id of the story to merge with the self one.
   */
  _merge : function(iSubStoryId){
    var self = this;
    var iMainStoryId = self._oStory.id();
    Cotton.CONTROLLER.mergeStoryInOtherStory(iMainStoryId, iSubStoryId,
        function(lVisitItemsIdToAdd){
          for(var i = 0; i < lVisitItemsIdToAdd.length; i++){
            self._oStory.addVisitItemId(lVisitItemsIdToAdd[i]);
          }
          // reload the visits.
          self.getVisits(function(){
            self.openStory(true);
          });
    });

  },

  _addVisitItem : function(iVisitItemId){
    var self = this;
    self._oStory.addVisitItemId(iVisitItemId);
    Cotton.CONTROLLER.setStory(self._oStory);
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

        // REMOVE
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

        // SET TITLE
        // Create an input field to change the title.
        var $input_title = $('<input class="ct-story_editable_title" type="text" name="title">');

        // Set the default value, with the current title.
        $input_title.val(self._oStory.title());
        $input_title.keypress(function(event) {
          // on press 'Enter' event.
          if (event.which == 13) {
            var sTitle = $input_title.val();
            self._$title.text(sTitle);
            $input_title.remove();
            self._$title.show();
            self._sTitleAlreadyEditable = false;

            // Set the title in the model.
            self._oStory.setTitle(sTitle);
            self.makeItNonEditable();
            Cotton.CONTROLLER.setStory(self._oStory);
          }
        });

        // hide the title and replace it by the input field.
        self._$title.hide();
        $input_title.insertAfter(self._$title);

        // SET IMAGE
        var $icon_image = $('<img class="ct-story_icon_image" src="/media/images/topbar/sticker/images.png">');
        var $input_image = $('<input class="ct-story_editable_image" type="text" name="image">');

        // Set the default value, with the current title.
        $input_image.val(self._$img.attr('src') || 'http://');
        $input_image.keypress(function(event) {
          // on press 'Enter' event.
          if (event.which == 13) {
            var sImageUrl = $input_image.val();
            self._$img.attr('src', sImageUrl);

            self.makeItNonEditable();
            self._oStory.setFeaturedImage(sImageUrl);
            Cotton.CONTROLLER.setStory(self._oStory);
          }
        });

        self._$sticker.append($icon_image, $input_image);

      } else {
        self.makeItNonEditable();
      }
    },

    /**
     * Make it non editable
     */
    makeItNonEditable : function(){
      var self = this;
      self._isEditable = false;
      self._$sticker.find('.ct-story_editable_title').remove();
      self._$sticker.find('.ct-story_editable_image').remove();
      self._$sticker.find('.ct-story_icon_image').remove();
      self._$sticker.find('.ct-stickers_button_remove').remove();
      self._$title.show();
    },

    /**
     * Recycle method is used to avoid issue performance. The idea is to use,
     * the memory already created and change parameters. That's avoid of
     * removing a sticker and create a new one.
     *
     * Moreover due to some issues i don't understand yet, remove all the
     * stickers is a guzzling time process. This method will avoid that.
     *
     * @param {Cotton.Model.Story} oStory
     */

    recycle : function(oStory){
      var self = this;

      self._oStory = oStory;
      self.getVisits(function(){});
      self._$sticker.attr('ct-story_id', self._oStory.id());

      // CONTENT
      var lVisitItems = self._oStory.visitItems();
      self._$title.text(self._oStory.title());

      if (self._oStory._sFeaturedImage !== "") {
        self._$img.attr("src", self._oStory._sFeaturedImage);
      } else {
       self._$img.attr("src", "/media/images/default_preview7.png");
      }

      // Load is a callback function, called when the image is ready.
      self._$img.load(function() {
        self.resizeImg($(this));
      });

    },
});

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
