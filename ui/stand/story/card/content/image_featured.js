"use strict";

Cotton.UI.Stand.Story.Card.Content.ImageFeatured =
  Cotton.UI.Stand.Common.Content.BImage.extend({

  /**
   * Creates an image with the correct size.
   * @param {string} sImage:
   *   url of the image to load
   */
  init : function(sImage) {
    // we init with the parent generic class Cotton.UI.Story.Card.Content.Image
    this._super();

    this._$image.addClass("ct-featured_image");
    this.appendImage(sImage);
  }
});