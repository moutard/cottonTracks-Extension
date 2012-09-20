'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Video = Cotton.UI.Story.Item.Content.Element
    .extend({

      _$video : null,
      _sVideoType : null,

      init : function(oItem, sVideoType, sEmbedCode) {
        this._spuer(oItem);

        this._sVideoType = sVideoType;

        // current sub elements.
        this._$video = $('<div class="ct-featured_image"></div>');

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
        this._$item_content.append(
            this._$video,
            this._oItemToolbox.$(),
            this._oItemDescription.$(),
            this._oItemDna.$()
        );
      },

});
