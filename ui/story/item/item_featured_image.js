'use strict';

/**
 * Item Image Contains the image link to the article.
 */
Cotton.UI.Story.Item.FeaturedImage = Class
    .extend({

      _oItemContent : null,

      _$featured_image : null,

      _$img : null,
      _sImageUrl : null,
      _bIsCropped : false,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;
        this._bIsCropped = this._oItemContent.item().visitItem().extractedDNA().imageCropped();

        if(this._oItemContent.item().visitItem().extractedDNA().imageUrl()){
	        // current item.
	        this._$featured_image = $('<div class="ct-featured_image"></div>');
	        this._$img = $('<img class="resize"></img>');
          this._sImageUrl = this._oItemContent.item().visitItem().extractedDNA().imageUrl();
          this._$img.attr('src', this._sImageUrl);
          if(this._bIsCropped){
            this._$featured_image.addClass('crop');
            var sMarginTop = this._oItemContent.item().visitItem().extractedDNA().imageMarginTop();
            this._$img.css("top", sMarginTop+"px");
          }

          this._$featured_image.append(this._$img);
        }
        if (this._$img){
          this.resize(this._$img);
        }
       // construct item

      },

      $ : function() {
        return this._$featured_image;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$featured_image);
      },

      setImageUrl : function(sUrl){
        this._sImageUrl = sUrl;
        this._$img.attr('src', sUrl);
        if(this._sImageUrl){
          self._$featured_image.append(self._$img);
        }
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
