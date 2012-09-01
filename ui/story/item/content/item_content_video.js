'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Video = Class
    .extend({

      _oItem : null,

      _$item_content : null,

      _$video : null,
      _sVideoType : null,
      _oItemToolbox : null,
      _oItemDescription : null,
      _oItemDna : null,

      init : function(oItem, sVideoType, sEmbedCode) {
        // current parent element.
        this._oItem = oItem;

        this._sVideoType = sVideoType;
        // current item.
        this._$item_content = $('<div class="ct-item_content"></div>');

        // current sub elements.
        this._$video = $('<div class="ct-featured_image"></div>');
        this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);
        this._oItemDescription = new Cotton.UI.Story.Item.Description(this);
        this._oItemDna = new Cotton.UI.Story.Item.Dna(this);

        // set values

        // video
        // Uses the right embed code depending on the video provider
        if (this._sVideoType == "youtube") {
          this._$video = $('<iframe width="400" height="225" src="" frameborder="0" allowfullscreen></iframe>');
          var sEmbedUrl = "http://www.youtube.com/embed/" + sEmbedCode;
          this._$video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "vimeo") {
          this._$video = $('<iframe width="400" height="225" src="" frameborder="0" webkitAllowFullscreen></iframe>');
          var sEmbedUrl = "http://player.vimeo.com/video/" + sEmbedCode
              + "?title=1&byline=0&portrait=0";
          this._$video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "dailymotion") {
          this._$video = $('<iframe width="400" height="225" src="" frameborder="0"></iframe>');
          var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
              + sEmbedCode
              + "?background=3E3E3E&foreground=EEEEEE&highlight=4EBBFF";
          this._$video.attr('src', sEmbedUrl);
        }

        // create the item
        this._$item_content.append(this._$video, this._oItemToolbox.$(),
            this._oItemDescription.$(), this._oItemDna.$());
      },

      $ : function() {
        return this._$item_content;
      },

      appendTo : function(oItem) {
        oItem.$().append(this._$item_content);
      },

    });
