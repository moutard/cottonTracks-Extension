'use strict';

/**
 * Image Contains the featured image for an article.
 */
Cotton.UI.Story.Item.Content.Brick.Dna.Image = Class.extend({

  _oItemContent : null,

  _sImage : null,

  _$featured_image : null,

  _$img : null,
  _sImageUrl : null,

  init : function(sImage, oItemContent, sImageType) {

    this._sImage = sImage;

    // parent element.
    this._oItemContent = oItemContent;

    if(sImage){
      // current item.
      this._$image = $('<div class="ct-image"></div>').addClass(sImageType);
      this._$img = $('<img class="resize"></img>');

      // set value
      this._$img.attr('src', this._sImage);

      // construct item
      this._$image.append(this._$img);
      this.resize(this._$img);
    }
  },

  $ : function() {
    return this._$image;
  },

  /**
   * Resize the image so it fits perfectly in the container.
   * @param {DOM} $img:
   *  dom img element you want to resize.
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
    });
  }

});
