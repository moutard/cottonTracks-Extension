'use strict';

/**
 * Ticket
 */
Cotton.UI.Home.Ticket = Class.extend({

  /**
   * Grid
   */
  _oGrid : null,
  _iId : undefined,
  _dRecord : undefined,
  _$ticket : null,

  _$ticket_image : null,
  _$ticket_head : null,
  _$ticket_title : null,
  _$ticket_link : null,
  _isEditable : false,

  init : function(oGrid, dRecord) {
    var self = this;

    self._oGrid = oGrid;

    self._iId = dRecord['id'];

    self._$ticket = $('<div class="ct-ticket"></div>');
    self._$ticket_image = $('<img class="ct-ticketImage"/>');
    self._$ticket_head = $('<div class="ct-ticketHead"></div>')
    self._$ticket_title = $('<h3></h3>');
    self._$ticket_link = $('<a class="ct-ticketLink"></div>');

    self._$ticket_image.attr('src', dRecord['image']);
    self._$ticket_title.text(dRecord['name']);
    self._$ticket_link.attr('href', dRecord['url']);

    // Create editable button.
    self._$editable_button = $('<div class="ct-stickers_button_editable"></div>').hide();
    self._$editable_button.mouseup(function(){
      self.makeItEditable();
    });
    self._$ticket.hover(function() {
      // Display editable button.
      self._$editable_button.show();

    }, function() {
      // Hide editable button.
      self._$editable_button.hide();
    });

    self._$ticket.append(self._$ticket_link.append(self._$ticket_image,
                          self._$ticket_head.append(self._$ticket_title)), self._$editable_button);

    //oGrid.append($ticket);

  },

  $ : function() {
    return this._$ticket;
  },

  setTop : function(iTop) {
    this._$ticket.css('top', iTop + "px");
  },

  setLeft : function(iLeft) {
    this._$ticket.css('left', iLeft + "px");
  },

  setWidth : function(iWidth) {
    this._$ticket.css('width', iWidth + "px");
  },

  setMargin : function(iMargin) {
    this._$ticket.css('margin-left', iMargin);
    this._$ticket.css('margin-right', iMargin);
  },

  setSmall : function() {
    this.setWidth(Cotton.UI.Home.SMALL_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.SMALL_MARGIN);
    this._$ticket_title.css('font-size', '12px');
    this._$ticket_head.css('padding-top', '10px');
    this._$ticket_head.css('padding-top', '5px');
  },

  setMedium : function() {
    this.setWidth(Cotton.UI.Home.MEDIUM_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.MEDIUM_MARGIN);
    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css('padding-top', '18px');
    this._$ticket_head.css('padding-top', '8px');
  },

  setLarge : function() {
    this.setWidth(Cotton.UI.Home.LARGE_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.LARGE_MARGIN);
    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css('padding-top', '20px');
    this._$ticket_head.css('padding-top', '10px');
  },

  makeItEditable : function() {
    var self = this;

    if (self._isEditable === false) {
      self._isEditable = true;

      // REMOVE
      var $remove_button = $('<div class="ct-stickers_button_remove"></div>');

      // Bind mouseup.
      $remove_button.mouseup(function() {
        // Ask confirmation.
        var bClear = confirm(
          "Are you sure you want to delete this ticket."
        );

        if (bClear) {
          // Remove DOM element.
          Cotton.CONTROLLER.removeFavoritesWebsite(self._iId);
          self._$ticket.remove();

        }
      });

      self._$ticket.append($remove_button);

      // SET TITLE
      // Create an input field to change the title.
      var $input_title = $('<input class="ct-story_editable_title" type="text" name="title">');

      // Set the default value, with the current title.
      $input_title.val(self._$ticket_title.text());
      $input_title.keypress(function(event) {
        // on press 'Enter' event.
        if (event.which == 13) {
          var sTitle = $input_title.val();
          self._$ticket_title.text(sTitle);
          $input_title.remove();
          self._$ticket_title.show();
          self._sTitleAlreadyEditable = false;

          // Set the title in the model.
          self._dRecord['title'] = sTitle;
          Cotton.CONTROLLER.setFavoritesWebsite(dRecord);

        }
      });

      // hide the title and replace it by the input field.
      self._$ticket_title.hide();
      $input_title.insertAfter(self._$ticket_title);

      // SET IMAGE
/*
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
*/
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
    self._$ticket.find('.ct-story_editable_title').remove();
    self._$ticket.find('.ct-story_editable_image').remove();
    self._$ticket.find('.ct-story_icon_image').remove();
    self._$ticket.find('.ct-stickers_button_remove').remove();
    self._$ticket_title.show();
  },
});
