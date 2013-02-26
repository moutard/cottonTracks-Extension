'use strict';

Cotton.UI.SideMenu.Sticker = Class.extend({

  _oMenu : null,
  _$sticker : null,
  _$featuredImageContainer : null,
  _$featuredImage : null,

  init: function(oMenu){

	  this._oMenu = oMenu;
	  this._$sticker = $(".ct-sticker");
	  this._$featuredImageContainer = $('<div class="ct-story_image"></div>');
	  this._$featuredImage = $('<img class="resize" src="">');

    //set values
    var sFeaturedImage = this._oMenu.story().featuredImage();
    if (sFeaturedImage != ""){
      this._$featuredImage.attr('src', sFeaturedImage);
      this._$featuredImageContainer.css({'background':' #4d4d4d'})
    }

    //construct element
	  this._$sticker.prepend(
	    this._$featuredImageContainer.append(
	      this._$featuredImage
	    )
	  );

	  this.resize(this._$featuredImage);

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
