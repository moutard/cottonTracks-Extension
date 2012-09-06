'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Slideshow = Class
    .extend({

      _oItem : null,

      _$item_content : null,

      _$slideshow : null,
      _oItemToolbox : null,

      init : function(oItem, sEmbedCode) {
        // current parent element.
        this._oItem = oItem;

        // current item.
        this._$item_content = $('<div class="ct-item_content"></div>');

        // current sub elements.
        this._$slideshow = $slideshow = $('<iframe width="380" height="316" marginwidth="0" marginheight="0" scrolling="no" src="" frameborder="0" allowfullscreen></iframe>');
        var sEmbedUrl = "http://www.slideshare.net/slideshow/embed_code/"
            + sEmbedCode;
        this._$slideshow.attr('src', sEmbedUrl);
        this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);

        // Image Url
        if (this._oItem._oVisitItem.extractedDNA().imageUrl() !== "") {
          this._$featuredImage.attr("src", this._oItem._oVisitItem
              .extractedDNA().imageUrl());
        }

        // create the item
        this._$item_content.append(this._$slideshow, this._oItemToolbox.$());
      },

      $ : function() {
        return this._$item_content;
      },

      appendTo : function(oItem) {
        oItem.$().append(this._$item_content);
      },

    });
