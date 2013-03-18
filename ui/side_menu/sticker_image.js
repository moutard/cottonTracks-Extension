'use strict';

/**
 *   Sticker image
 **/

Cotton.UI.SideMenu.StickerImage = Class.extend({

  _oSticker : null,
  _$sticker : null,
  _$stickerImageContainer : null,
  _$stickerImage : null,
  _sStickerImage : null,

  init: function(oSticker){

	  this._oSticker = oSticker;
	  this._$stickerImageContainer = $('<div class="ct-story_image"></div>');
	  this._$stickerImage = $('<img class="resize" src="">');

    //set values
    var sStickerImage = this._sStickerImage
                      = this._oSticker.sumUp().menu().story().featuredImage();

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
  },

  refresh : function(){
    var lHistoryItems = this._oSticker.sumUp().menu().world().lightyear().historyItems();
    if (lHistoryItems && this._sStickerImage === ""){
      for ( var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
        var oHistoryItem = lHistoryItems[i];
        if (oHistoryItem.extractedDNA().imageUrl()
          && oHistoryItem.extractedDNA().imageUrl() !== ""){
            this._sStickerImage = oHistoryItem.extractedDNA().imageUrl();
            break;
        }
      }
    }
    if (this._sStickerImage && this._sStickerImage !==""){
      this._$stickerImage.attr('src', this._sStickerImage);
      this._$stickerImageContainer.css({'background':' #4d4d4d'});
    }
  }

});