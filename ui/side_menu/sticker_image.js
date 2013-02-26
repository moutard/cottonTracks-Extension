'use strict';

Cotton.UI.SideMenu.StickerImage = Class.extend({

  _oMenu : null,
  _$sticker : null,
  _$stickerImageContainer : null,
  _$stickerImage : null,

  init: function(oMenu){
	  
	  this._oMenu = oMenu;
	  this._$stickerImageContainer = $('<div class="ct-story_image"></div>');
	  this._$stickerImage = $('<img class="resize" src="">');
    
    //set values
    var sStickerImage = this._oMenu.story().featuredImage();
    if (sStickerImage != ""){
      this._$stickerImage.attr('src', sStickerImage);
      this._$stickerImageContainer.css({'background':' #4d4d4d'})
    }
    
    //construct element
	  this._$stickerImageContainer.append(
	    this._$stickerImage
	  );

    //resize sticker image to fit its container
	  this.resize(this._$stickerImage);
    
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
  }

});