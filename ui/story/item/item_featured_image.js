'use strict';

/**
 * Item Image Contains the image link to the article.
 */
Cotton.UI.Story.Item.FeaturedImage = Class
    .extend({

      _oItemContent : null,

      _$item_featured_image : null,

      _$img : null,

      init : function(oItemContent) {
        // current parent element.
        this._oItemContent = oItemContent;

        // current item.
        this._$featured_image = $('<div class="ct-featured_image"></div>');
        this._$img = $('<img ></img>');
        if(this._oItemContent.item().visitItem().extractedDNA().imageUrl()){
          this._$img.attr('src', this._oItemContent.item().visitItem().extractedDNA().imageUrl());
          this._$featured_image.append(this._$img);
        }

      },

      $ : function() {
        return this._$item_featured_image;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$item_featured_image);
      },

      editImage : function(){

      },

});
