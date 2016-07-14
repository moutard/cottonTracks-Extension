"use strict";

/**
 * DImage - DivImage
 *
 * This is a parent class, extended to Cotton.UI.Stand.Story.Card.Content.ImageFull,
 * and to Cotton.UI.Stand.Story.Card.Content.ImageFeatured
 *
 * This class use image as div.
 */
Cotton.UI.Stand.Common.Content.DImage = Class.extend({

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
    if (sImage && sImage !== "") {
      // Image element.
      var $img = $('<img class="ct-resize" src="' + sImage + '"></img>');

      // Place image in its container and resize it.
      this._$image.append($img);
      this.resize($img);
    }
  },

  /**
   * Resize the image so it fits perfectly in the container.
   * @param {DOM} $img:
   *          dom img element you want to resize.
   */
  resize : function($img) {
    $img.load(function(){

      //image size and ratio
      var iImWidth = $img.width();
      var iImHeight = $img.height();
      var fImRatio = iImWidth/iImHeight;

      //div size and ratio
      var iDivWidth = $img.parent().width();
      var iDivHeight = $img.parent().height();
      var fDivRatio = iDivWidth/iDivHeight;

      //center image according on how it overflows
      //if vertical, keep the upper part more visible
      if (fImRatio > fDivRatio) {
        $img.css('height',iDivHeight);
        var iOverflow = $img.width()-iDivWidth;
        $img.css('left',-iOverflow*0.5);
      } else {
        $img.css('width',iDivWidth);
        var iOverflow = $img.height()-iDivHeight;
        $img.css('top',-iOverflow*0.25);
      }
      $img.addClass('show');
      $(this).unbind('load');
    });
  },

  purge : function() {
    this._$image.remove();
    this._$image = null;
  }

});