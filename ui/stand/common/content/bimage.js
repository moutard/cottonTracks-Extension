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
  appendImage : function(sImage) {
    if (sImage) {
      // Place image in its container and resize it.
      this._$image.css('background-image', 'url("' + sImage + '")');
    }
  },

  purge : function() {
    this._$image.remove();
    this._$image = null;
  }

});
