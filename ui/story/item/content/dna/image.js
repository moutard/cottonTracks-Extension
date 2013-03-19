'use strict';

/**
 * Image Contains the featured image for an article.
 */
Cotton.UI.Story.Item.Content.Dna.Image = Class.extend({

  _oItemContent : null,

  _sImage : null,

  _$featured_image : null,

  _$img : null,
  _sImageUrl : null,

  init : function(sImage, oItemContent) {

    this._sImage = sImage;

    // parent element.
    this._oItemContent = oItemContent;

    if(sImage){
      // current item.
      this._$featured_image = $('<div class="ct-featured_image"></div>');
      this._$img = $('<img class="resize"></img>');

      // set value
      this._$img.attr('src', this._sImageUrl);

      // construct item
      this._$featured_image.append(this._$img);
      this.resize(this._$img);
    }
  },

  $ : function() {
    return this._$featured_image;
  },

  /**
   * Resize the image so it fits perfectly in the container.
   * @param {DOM} $img:
   *  dom img element you want to resize.
   */
  resize : function($img) {
    $img.load(function(){
      var self = $(this);

      //image size and ratio
      var iImWidth = self.width();
      var iImHeight = self.height();
      var fImRatio = iImWidth/iImHeight;

      //div size and ratio
      var iDivWidth = self.parent().width();
      var iDivHeight = self.parent().height();
      var fDivRatio = iDivWidth/iDivHeight;

      //center image according on how it overflows
      //if vertical, keep the upper part more visible
      if (fImRatio > fDivRatio) {
        self.css('height',iDivHeight);
        var iOverflow = self.width()-iDivWidth;
        self.css('left',-iOverflow*0.5);
      } else {
        self.css('width',iDivWidth);
        var iOverflow = self.height()-iDivHeight;
        self.css('top',-iOverflow*0.25);
      }
      $(this).show();
    });
  }

});
