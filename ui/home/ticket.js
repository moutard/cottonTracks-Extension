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
    self._dRecord = dRecord;
    self._iId = dRecord['id'];

    self._$ticket = $('<div class="ct-ticket"></div>');
    self._$ticket_image = $('<img class="ct-ticket_image"/>');
    self._$ticket_head = $('<div class="ct-ticket_head"></div>')
    self._$ticket_title = $('<h3></h3>');
    self._$ticket_link = $('<div class="ct-ticket_link"></div>').click(
        function(event){
          if($(event.target).is('.ct-favorite_save_button')){
            event.preventDefault();
            return;
          }
          chrome.tabs.update({
            'url': dRecord['url'],
          })
        });

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

  setHeight : function(iHeight) {
    this._$ticket.css('height', iHeight + "px");
  },

  setMargin : function(iMargin) {
    this._$ticket.css('margin-left', iMargin);
    this._$ticket.css('margin-right', iMargin);
  },

  setSmall : function() {
    this._$ticket.css({ 'width': Cotton.UI.Home.SMALL_WIDTH_WITHOUT_PADDING,
                        'height': Cotton.UI.Home.SMALL_HEIGHT_WITHOUT_PADDING,
                        'margin-left': Cotton.UI.Home.SMALL_MARGIN,
                        'margin-right':  Cotton.UI.Home.SMALL_MARGIN
    });
    this._$ticket_title.css('font-size', '12px');
    this._$ticket_head.css({'padding-bottom': '10px',
                            'padding-top': '5px'});
  },

  setMedium : function() {
    this._$ticket.css({ 'width': Cotton.UI.Home.MEDIUM_WIDTH_WITHOUT_PADDING,
                        'height': Cotton.UI.Home.MEDIUM_HEIGHT_WITHOUT_PADDING,
                        'margin-left': Cotton.UI.Home.MEDIUM_MARGIN,
                        'margin-right':  Cotton.UI.Home.MEDIUM_MARGIN
    });

    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css({'padding-bottom': '18px',
                            'padding-top': '8px'});
  },

  setLarge : function() {
     this._$ticket.css({ 'width': Cotton.UI.Home.LARGE_WIDTH_WITHOUT_PADDING,
                        'height': Cotton.UI.Home.LARGE_HEIGHT_WITHOUT_PADDING,
                        'margin-left': Cotton.UI.Home.LARGE_MARGIN,
                        'margin-right':  Cotton.UI.Home.LARGE_MARGIN
    });

    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css({'padding-bottom': '20px',
                            'padding-top': '10px'});
  },

  makeItEditable : function() {
    var self = this;

    if (self._isEditable === false) {
      self._isEditable = true;
      self._$ticket_image.css('top', '-85px');

      var $edit_form = $('<div class="ct-favorite_edit_form"></div>');
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
          self._dRecord['name'] = sTitle;
          Cotton.CONTROLLER.setFavoritesWebsite(self._dRecord);

        }
      });

       // SET URL
      // Create an input field to change the title.
      var $input_url = $('<input class="ct-favorite_editable_url" type="text" name="url">');

      // Set the default value, with the current title.
      $input_url.val(self._dRecord['url']);
      $input_url.keypress(function(event) {
        // on press 'Enter' event.
        if (event.which == 13) {
          var sUrl = $input_url.val();
          self._dRecord['url'] = sUrl;

          Cotton.CONTROLLER.setFavoritesWebsite(self._dRecord);

        }
      });

      // SAVE BUTTON
      var $save_button = $('<div class="ct-favorite_save_button">Save</div>')
        .click(function(event){
          event.preventDefault();
          self._dRecord['url'] =  $input_url.val();
          self._dRecord['name'] = $input_title.val();
          Cotton.CONTROLLER.setFavoritesWebsite(self._dRecord);
          self.makeItNonEditable();
        });
      // hide the title and replace it by the input field.

      self._$ticket_link.prepend( $edit_form.append(
            $remove_button,
            $input_url,
            $save_button)
          );
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
    self._$ticket_image.css('top', '0px');
    self._isEditable = false;
    self._$ticket.find('.ct-story_editable_title').remove();
    self._$ticket.find('.ct-favorite_edit_form').remove();
    self._$ticket_title.show();
    //self._$ticket_link.attr("href", self._dRecord['url']);
  },
});
