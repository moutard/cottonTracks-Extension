"use strict";

/**
 * Image
 *
 * This is a parent class, extended to Cotton.UI.Stand.Story.Card.Content.ImageFull,
 * and to Cotton.UI.Stand.Story.Card.Content.ImageFeatured
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
  appendImage : function(sImage, bForce) {
    var self = this;
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

  /**
   * No need to check the image to append default.
   * It's like a force append.
   */
  appendDefault : function(iId) {
    this._$image.css('background-image', 'url("/media/images/common/ct-no_sticker_image' + iId + '.png")');
  },

  purge : function() {
    this._$image.remove();
    this._$image = null;
  }

});
