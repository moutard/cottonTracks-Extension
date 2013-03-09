'use strict';

/**
 * Item_content_video contains a double container for the video
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Content.Video = Cotton.UI.Story.Item.Content.Element
    .extend({

      _$video : null,
      _sVideoType : null,
      _oItemLabel : null,
      _oItemMenu : null,

      _$itemDoubleContainer : null,

      init : function(oItem, sVideoType, sEmbedCode) {
        self = this;
        this._super(oItem);
        this._sVideoType = sVideoType;
        oItem.$().addClass('ct-item-video');

        this._oItemLabel = new Cotton.UI.Story.Item.LargeLabel(this);
        this._oItemMenu = new Cotton.UI.Story.Item.LargeMenu(this);

        this._$itemDoubleContainer = $('<div class="ct-doublecontainer"></div>');

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
        this._$item_content.append(
          self._$itemDoubleContainer.append(self._$video),
          self._oItemLabel.$(),
          self._oItemMenu.$()
        );
      },

    });