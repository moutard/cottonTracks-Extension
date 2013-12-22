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
      self.toggleEdit(oStory);
    });

    // Title of the story.
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
        oGlobalDispatcher.publish('open_cheesecake', {
          'cheesecake': oStory
        });
        oGlobalDispatcher.publish('push_state', {
          'code': '?did=',
          'value': oStory.id()
        });
      } if (sContext === 'cover') {
        // analytics tracking
        Cotton.ANALYTICS.openStory('sticker');


        if (self._$sticker.parents().hasClass('ct-related_cover')){
          var sStoryContext = 'related';
        } else {
          var sStoryContext = 'manager';
        }
        // analytics tracking
        Cotton.ANALYTICS.storyContext(sStoryContext);

        oGlobalDispatcher.publish('push_state', {
          'code': '?sid=',
          'value': oStory.id()
        });
        oGlobalDispatcher.publish('enter_story', {
          'story': oStory
        });
      }
    });

    this._oLocalDispatcher.subscribe('edit_title', this, function(dArguments){
      this._$title.text(dArguments['title']);
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
        this._$title
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
    this._$toggle_edit.toggleClass('ct-edit_open');
    if (this._$toggle_edit.hasClass('ct-edit_open')) {
      this._$toggle_edit.text('Done');
      this._oEdit = new Cotton.UI.Stand.Common.Edit(oStory, this._oLocalDispatcher, this._oGlobalDispatcher);
      this._$sticker.append(this._oEdit.$());
    } else {
      this._$toggle_edit.text('Edit');
      oStory.setTitle(this._oEdit.getTitle());
      this._oGlobalDispatcher.publish('update_db_cheesecake', {'cheesecake': oStory});
      this.purgeEdit();
    }
  },

  purgeEdit : function() {
    if (this._oEdit) {
      this._oEdit.purge();
      this._oEdit = null;
    }
  },

  purge : function() {
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
