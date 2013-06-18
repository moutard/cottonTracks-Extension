'use strict';

/**
 *   Sticker image
 */

Cotton.UI.SideMenu.Preview.Sticker.Image = Class.extend({

  _$stickerImageContainer : null,
  _$stickerImage : null,

  init: function(sImage){
    // Current element.
    this._$stickerImageContainer = $('<div class="ct-story_image"></div>');

    // Sub elements.
    this._$stickerImage = $('<img class="resize">');

    // Construct element.
	  this._$stickerImageContainer.append(
	    this._$stickerImage
	  );

    // We do it after construction of the element for resize() to work
    if (sImage && sImage !== ""){
      this.recycle(sImage);
    }

  },

  $ : function() {
	  return this._$stickerImageContainer;
  },

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
  },

  recycle : function(sImage) {
    sImage = unescape(unescape(sImage));
    this._$stickerImageContainer.addClass('plain');
    this._$stickerImage.attr('src', sImage);
    // Resize sticker image to fit its container.
    this.resize(this._$stickerImage);
  },

});
