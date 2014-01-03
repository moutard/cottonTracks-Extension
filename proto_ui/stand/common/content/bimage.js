"use strict";

/**
 * Image
 *
 * This is a parent class, extended to Cotton.UI.Stand.Cheesecake.Card.Content.ImageFull,
 * and to Cotton.UI.Stand.Cheesecake.Card.Content.ImageFeatured
 */
Cotton.UI.Stand.Common.Content.BImage = Class.extend({

  /**
   * {DOM} element that constrains an image to the right dimension and position.
   */
  _$image : null,

  init : function() {
    this._$image = $('<div class="ct-media_image"></div>');
  },

  $ : function() {
    return this._$image;
  },

  /**
   * Append the image in a container that will determine its size. Then call resize function
   * @param {string} sImage:
   *        url of the image to load
   */
  appendImage : function(sImage) {
    var self = this;
    this._sImage = sImage;
    var $img = $('<img src="' + sImage + '"/>').error(function(){
      $(this).unbind('load').unbind('error');
      if (self._$image){
        // the condition is because the .error() is asynchronous,
        // the image object may have been purged in the meantime,
        // which would throw an error
        self._$image.css('background-image', 'url("/media/images/story/card/ct-broken_image.png")');
      }
    }).load(function(){
      $(this).unbind('load').unbind('error');
      if (self._$image){
        // Place image in its container and resize it.
        self._$image.css('background-image', 'url("' + sImage + '")');
      }
    });
  },

  image : function() {
    return this._sImage;
  },

  select : function(oLocalDispatcher) {
    var self = this;
    this._$image.click(function(){
      oLocalDispatcher.publish('edit_image', {
        'image' : self.image()
      });
      $(this).addClass('ct-image_selected');
    });
  },

  purge : function() {
    this._sImage = null;
    this._$image.remove();
    this._$image = null;
  }

});
