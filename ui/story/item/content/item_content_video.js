'use strict';

/**
 * Item_content_video contains a double container for the video
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Content.Video = Cotton.UI.Story.Item.Content.Element
    .extend({

      _sVideoType : null,

      // sub elements.
      _$video : null,
      _$itemDoubleContainer : null,
      _oItemLabel : null,

      init : function(oHistoryItem, sVideoType, sEmbedCode, oItem) {
        this._super(oHistoryItem, oItem);
        this._sType = "video";
        this._sVideoType = sVideoType;

        // current element.
        this._$content.addClass('ct-content_video video');

        // sub elements.
        this._$itemDoubleContainer = $('<div class="ct-double_container"></div>');

        this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.LargeLabel(
          oHistoryItem.title(), oHistoryItem.url(), this);


        // video
        // Uses the right embed code depending on the video provider
        if (this._sVideoType == "youtube") {
          this._$video = $('<iframe width="360" height="260" src="" frameborder="0" allowfullscreen></iframe>');
          var sEmbedUrl = "http://www.youtube.com/embed/" + sEmbedCode;
          this._$video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "vimeo") {
          this._$video = $('<iframe width="360" height="260" src="" frameborder="0" webkitAllowFullscreen></iframe>');
          var sEmbedUrl = "http://player.vimeo.com/video/" + sEmbedCode
              + "?title=1&byline=0&portrait=0";
          this._$video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "dailymotion") {
          this._$video = $('<iframe width="360" height="260" src="" frameborder="0"></iframe>');
          var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
              + sEmbedCode
              + "?background=3E3E3E&foreground=EEEEEE&highlight=5bab7d";
          this._$video.attr('src', sEmbedUrl);
        }

        // create the item
        this._$content.append(
          this._$itemDoubleContainer.append(this._$video),
          this._oItemLabel.$()
        );
      }

    });
