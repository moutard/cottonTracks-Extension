'use strict';

/**
 * Video : brick that allows to insert a video.
 */
Cotton.UI.Story.Item.Content.Brick.Dna.Video = Class.extend({

  _oItem : null,

  _sEmbedCode : null,
  _sVideoType : null,

  _$video : null,

  init : function(sEmbedCode, sVideoType, oItem) {

    this._sEmbedCode = sEmbedCode;
    this._sVideoType = sVideoType;

    // parent element.
    this._oItem = oItem;

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
  },

  $ : function() {
    return this._$video;
  }

});
