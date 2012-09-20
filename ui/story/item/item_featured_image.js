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
        var self = this;
        if(!self._sImageAlreadyEditable){
          self._sImageAlreadyEditable = true;
          // Create an input field to change the title.
          var $input_image = $('<input class="ct-editable_image" type="text" name="image">');

          // Set the default value, with the current title.
          $input_image.val(self._$img.attr('src') || 'http://');
          $input_image.keypress(function(event) {
            // on press 'Enter' event.
            if (event.which == 13) {
              if(!self._sImageUrl){
                self._$featured_image.append(self._$img);
              }
              self._sImageUrl = $input_image.val();
              self._$img.attr('src', self._sImageUrl);
              $input_image.remove();
              //self._$title.show();
              self._sImageAlreadyEditable = false;

              // Set the title in the model.
              self._oItemContent.item().visitItem().extractedDNA().setImageUrl(self._sImageUrl);
              self._oItemContent.item().visitItemHasBeenSet();
            }
          });

          // hide the title and replace it by the input field.
          //self._$title.hide();
          self._$featured_image.append($input_image);
        }
      },

});
