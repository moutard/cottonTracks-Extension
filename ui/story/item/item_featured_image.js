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
        // current item.
        this._$featured_image = $('<div class="ct-featured_image"></div>');
        this._$img = $('<img class="resize"></img>');

        if(this._oItemContent.item().visitItem().extractedDNA().imageUrl()){
          this._sImageUrl = this._oItemContent.item().visitItem().extractedDNA().imageUrl();
          this._$img.attr('src', this._sImageUrl);
          if(this._bIsCropped){
            this._$featured_image.addClass('crop');
            var sMarginTop = this._oItemContent.item().visitItem().extractedDNA().imageMarginTop();
            this._$img.css("top", sMarginTop+"px");
          }

          this._$featured_image.append(this._$img);
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

      editImage : function(){
        var self = this;
        if(!self._sImageAlreadyEditable){
          self._sImageAlreadyEditable = true;
          self._$button_crop_image = $('<div class="ct-button_crop_image"></div>');

          // Crop the image
          self._$button_crop_image.mouseup(function(){
            if(!self._bIsCropped){
              self._bIsCropped = true;
              // Remember that the image is cropped.
              self._oItemContent.item().visitItem().extractedDNA().setImageCropped(1);
              self._oItemContent.item().visitItemHasBeenSet();

              // Allow to move the image to feat perfectly.
              self._$featured_image.addClass("crop");
              self._$img.draggable('enable').css("cursor", "move");
            } else {
              self._bIsCropped = false;
              // Remember that the image is not cropped.
              self._oItemContent.item().visitItem().extractedDNA().setImageCropped(0);
              self._oItemContent.item().visitItemHasBeenSet();

              //
              self._$featured_image.removeClass("crop");
              self._$img.draggable('disable').css('top', '0px').css("cursor", "auto");
            }
          });

          // Create an input field to change the image url.
          self._$input_image = $('<input class="ct-editable_image" type="text" name="image">');

          // Set the default value, with the current image url.
          self._$input_image.val(self._$img.attr('src') || 'http://');
          self._$input_image.keypress(function(event) {
            // on press 'Enter' event.
            if (event.which == 13) {
              if(!self._sImageUrl){
                self._$featured_image.append(self._$img);
              }
              self._sImageUrl = self._$input_image.val();
              if((self._sImageUrl === "") || (self._sImageUrl === "http://")){
                self._$img.remove();
                self._$img = $('<img ></img>');
              } else {
                self._$img.attr('src', self._sImageUrl);
              }
              self._$button_crop_image.remove();
              self._$input_image.remove();
              self._sImageAlreadyEditable = false;
              
              // Event tracking
              Cotton.ANALYTICS.changeItemImage();

              // Set the image url in the model.
              self._oItemContent.item().visitItem().extractedDNA().setImageUrl(self._sImageUrl);
              self._oItemContent.item().visitItemHasBeenSet();
            }
          });

          // Reveal the input field for image url.
          self._$featured_image.append(self._$input_image);
          // Put crop only if there is an image.
          if(self._$img.attr('src')){
            self._$featured_image.append(self._$button_crop_image);
          }
        }
      },

      stopEditImage :function(){
        var self = this;
        self._$button_crop_image.remove();
        self._$input_image.remove();
        self._sImageAlreadyEditable = false;
      },

});
