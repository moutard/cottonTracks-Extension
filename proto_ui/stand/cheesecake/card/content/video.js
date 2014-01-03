'use strict';

/**
 * Video : content class that allows to insert a video.
 */
Cotton.UI.Stand.Cheesecake.Card.Content.Video = Class.extend({

  /**
   * {DOM} container for the thumbnail and the iframe embedded video
   **/
  _$video_container : null,

  /**
   * @param{string} sEmbedCode:
   *    embed code of the video, not taken directly from the historyItem because the card factory
   *    extracts it from the url
   * @param{string} sVideoType:
   *    video provider (vimeo, youtube, dailymotion)
   * (optional) @param{string} sImageUrl
   **/
  init : function(sEmbedCode, sVideoType, sImageUrl) {
    var self = this;
    this._sEmbedCode = sEmbedCode;

    this._sVideoType = sVideoType;

    this._$video_container = $('<div class="ct-media_video ct-full_video"></div>').click(function(){
      self.loadVideo(sEmbedCode, sVideoType);
    });

    this.getImage(sImageUrl, function(sImage){
      self._$video_container.css('background-image', 'url("' + sImage + '")');
    });
  },

  $ : function() {
    return this._$video_container;
  },

  getImage : function(sImageUrl, mCallback) {
    if (sImageUrl) {
      mCallback(sImageUrl);
    } else {
      // Uses the right embed code depending on the video provider
      switch (this._sVideoType) {
        case 'youtube':
          var sThumbnailSrc = 'http://img.youtube.com/vi/'
            + this._sEmbedCode + '/hqdefault.jpg';
          mCallback(sThumbnailSrc);
        break;

        case 'vimeo':
          var sThumbnailSrc;
          // Ajax call for Vimeo thumbnail
          $.ajax({
            url: 'http://vimeo.com/api/v2/video/' + this._sEmbedCode + '.json',
          }).done(function ( data ) {
              sThumbnailSrc = data[0]['thumbnail_large'];
              mCallback(sThumbnailSrc);
          });
        break;

        case 'dailymotion':
          var sThumbnailSrc = 'http://www.dailymotion.com/thumbnail/video/' + this._sEmbedCode;
          mCallback(sThumbnailSrc);
        break;
      }
    }
  },

  /**
   * Create and append the embedded video iframe
   * @param{string} sEmbedCode:
   *    embed code of the video, not taken directly from the historyItem because the card factory
   *    extracts it from the url
   * @param{string} sVideoType:
   *    video provider (vimeo, youtube, dailymotion)
   */
  loadVideo : function(sEmbedCode, sVideoType) {
    // analytics tracking.
    Cotton.ANALYTICS.playVideo(sVideoType);

    this._$video_container.addClass('ct-play');

    switch (sVideoType) {
      case 'youtube':
        var sEmbedUrl = "http://www.youtube.com/embed/" + sEmbedCode + "?autoplay=1";
        var $video = $('<iframe width="425" height="250" src="' + sEmbedUrl + '" frameborder="0" allowfullscreen></iframe>');
        this._$video_container.append($video);
      break;

      case 'vimeo':
        var sEmbedUrl = "http://player.vimeo.com/video/" + sEmbedCode
          + "?title=1&byline=0&portrait=0&autoplay=1";
        var $video = $('<iframe width="425" height="250" src="'+ sEmbedUrl +'" frameborder="0" webkitAllowFullscreen></iframe>');
        this._$video_container.append($video);
      break;

      case 'dailymotion':
        var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
            + sEmbedCode
            + "?background=3E3E3E&foreground=EEEEEE&highlight=5bab7d&autoplay=1";
        var $video = $('<iframe width="425" height="250" src="'+ sEmbedUrl +'" frameborder="0"></iframe>');
        this._$video_container.append($video);
      break;
    }
  },

  purge : function() {
    this._$video_container.empty().remove();
    this._$video_container = null;
  }


});