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

      init : function(oItemContent) {
        // current parent element.
        this._oItemContent = oItemContent;

        // current item.
        this._$featured_image = $('<div class="ct-featured_image"></div>');
        this._$img = $('<img ></img>');
        if(this._oItemContent.item().visitItem().extractedDNA().imageUrl()){
          this._sImageUrl = this._oItemContent.item().visitItem().extractedDNA().imageUrl();
          this._$img.attr('src', this._sImageUrl);
          this._$featured_image.append(this._$img);
        }

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
          this._$featured_image.append(this._$img);
        }
      },

      editImage : function(){

      },

});
