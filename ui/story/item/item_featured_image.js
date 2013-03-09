'use strict';

/**
 * Item_Featured_Image Contains the featured image for an article.
 */
Cotton.UI.Story.Item.FeaturedImage = Class
    .extend({

      _oItemContent : null,

      _$featured_image : null,

      _$img : null,
      _sImageUrl : null,

      init : function(oItemContent) {
        var self = this;

        // current parent element.
        this._oItemContent = oItemContent;

        if (this._oItemContent.item().visitItem().extractedDNA().imageUrl()){
          // current item.
          this._$featured_image = $('<div class="ct-featured_image"></div>');
          this._$img = $('<img class="resize"></img>');

          // set value
          this._sImageUrl =
              this._oItemContent.item().visitItem().extractedDNA().imageUrl();
          this._$img.attr('src', this._sImageUrl);

          // construct item
          this._$featured_image.append(this._$img);
        }
        if (this._$img){
          this.resize(this._$img);
        }
      },

      $ : function() {
        return this._$featured_image;
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
