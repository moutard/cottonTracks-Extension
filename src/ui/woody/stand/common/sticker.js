"use strict";

Cotton.UI.Stand.Common.Sticker = Class.extend({

  /**
   * {DOM} sticker with the featured image and the title
   **/
  _$sticker : null,

  /**
   * {DOM} image of the sticker
   **/
  _$image : null,

  /**
   * {DOM} title of the sticker
   **/
  _$title : null,

  /**
   * {Cotton.UI.Stand.Common.Content.Image} image object that resizes in
   * its container
   **/
  _oImage : null,

  init : function(oStory, sContext, oGlobalDispatcher) {
    var self = this;

    this._id = oStory.id();
    this._oLocalDispatcher = new Cotton.Messaging.Dispatcher();
    this._oGlobalDispatcher = oGlobalDispatcher;

    // Sticker, contains featuredImage and title.
    this._$sticker = $('<div class="ct-sticker"></div>');

    this._$toggle_edit = $('<div class="ct-sticker_edit_button">Edit</div>');

    this._$toggle_edit.click(function(){
      if (!self._$toggle_edit.hasClass('ct-edit_open')) {
        self._oGlobalDispatcher.publish('close_all_edit');
      }
      self.toggleEdit(oStory);
    });

    // Title of the story.
    this._$label = $('<div class="ct-sticker_label"></div>');
    this._$visibility = $('<div class="ct-sticker_visibility ct-private"></div>');
    this._$private_legend = $('<div class="ct-private_legend">This is private.</br>Everything is stored on</br>your computer.</div>');
    this._$title = $('<div class="ct-sticker_title"></div>').text(oStory.title());

    // featuredImage. Because we resize it we use the
    // Cotton.UI.Stand.Common.Content.Image class we cannot use var oImage then
    // release it when it creates the dom element because there are the
    // asynchronous 'error' and 'load' events.
    this._oImage = new Cotton.UI.Stand.Common.Content.BImage();
    var sImageUrl = oStory.featuredImage();
    if (sImageUrl) {
      this._oImage.appendImage(sImageUrl);
    }


    // Click the image to enter the story.
    this._oImage.$().addClass('ct-sticker_image').click(function(){
      if (sContext === 'library') {
        Cotton.ANALYTICS.openDeck();
        oGlobalDispatcher.publish('open_cheesecake', {
          'cheesecake': oStory
        });
        oGlobalDispatcher.publish('push_state', {
          'code': '?did=',
          'value': oStory.id()
        });
      }
    });

    this._oLocalDispatcher.subscribe('edit_title', this, function(dArguments){
      this._$title.text(dArguments['title']);
    });

    this._oGlobalDispatcher.subscribe('window_resize', this, function(dArguments){
      this.positionEdit(dArguments['width']);
    });

    this._oGlobalDispatcher.subscribe('close_all_edit', this, function(){
      if (self._$toggle_edit.hasClass('ct-edit_open')) {
        self.toggleEdit(oStory);
      }
    });

    this._oLocalDispatcher.subscribe('edit_image', this, function(dArguments){
      // unselect all images before the clicked image add its selected class
      if (this._oEdit) {
        this._oEdit.unselectAllImages();
      }
      this._oImage.appendImage(dArguments['image']);
      oStory.setFeaturedImage(dArguments['image']);
    });

    this._$sticker.append(
      this._oImage.$(),
      this._$toggle_edit,
      this._$label.append(
        this._$visibility.append(
          this._$private_legend
        ),
        this._$title
      )
    );
  },

  $ : function() {
    return this._$sticker;
  },

  id : function() {
    return this._id
  },

  updateImage : function(sImageUrl) {
    if (sImageUrl) {
      this._oImage.appendImage(sImageUrl);
    }
  },

  toggleEdit : function(oStory) {
    if (this._$toggle_edit.hasClass('ct-edit_open')) {
      Cotton.ANALYTICS.editDeckSticker('close');
      this._$toggle_edit.text('Edit');
      oStory.setTitle(this._oEdit.getTitle());
      this._oGlobalDispatcher.publish('update_db_cheesecake', {'cheesecake': oStory});
      this.purgeEdit();
    } else {
      Cotton.ANALYTICS.editDeckSticker('open');
      this._$toggle_edit.text('Done');
      this._oEdit = new Cotton.UI.Stand.Common.Edit(oStory, this._oLocalDispatcher, this._oGlobalDispatcher);
      this._$sticker.append(this._oEdit.$());
      this.positionEdit($(window).width());
    }
    this._$toggle_edit.toggleClass('ct-edit_open');
  },

  positionEdit : function(iWindowWidth) {
    if (!this._oEdit) {
      return;
    }
    var EDIT_WIDTH_AND_MARGIN = 300;
    var iEditOffset = this._$toggle_edit.offset().left;
    if (iEditOffset + EDIT_WIDTH_AND_MARGIN > iWindowWidth) {
      this._oEdit.$().addClass('ct-left_edit');
    } else {
      this._oEdit.$().removeClass('ct-left_edit');
    }
  },

  purgeEdit : function() {
    if (this._oEdit) {
      this._oEdit.purge();
      this._oEdit = null;
    }
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
    this._oGlobalDispatcher.unsubscribe('close_all_edit', this);
    this._oGlobalDispatcher = null;
    this._oLocalDispatcher.unsubscribe('edit_title', this);
    this._oLocalDispatcher.unsubscribe('edit_image', this);
    this._oLocalDispatcher = null;
    this._oGlobalDispatcher = null;
    this._id = null;
    this.purgeEdit();
    this._oImage.$().unbind('click');
    this._oImage.purge();
    this._oImage = null;
    // blur in case it was being edited
    this._$title.blur().remove();
    this._$title = null;
    this._$toggle_edit.remove();
    this._$toggle_edit = null;
    this._$sticker.remove();
    this._$sticker = null;
  }

});
