'use strict';

/**
 * Video : content class that allows to insert a video.
 */
Cotton.UI.Stand.Story.Card.Content.Video = Class.extend({

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
   * @param{Cotton.Messaging.Dispatcher} oLocalDispatcher
   **/
  init : function(sEmbedCode, sVideoType, oLocalDispatcher) {
    var self = this;

    this._$video_container = $('<div class="ct-media_video ct-full_video"></div>').click(function(){
      self.loadVideo(sEmbedCode, sVideoType);
      oLocalDispatcher.publish('load_video');
    });

    // video
    // Uses the right embed code depending on the video provider
    switch (sVideoType) {
      case 'youtube':
        var sThumbnailSrc = 'http://img.youtube.com/vi/'
          + sEmbedCode + '/hqdefault.jpg';
        self._$video_container.css('background-image', 'url("' + sThumbnailSrc + '")');
        oLocalDispatcher.publish('media_async_image', {'img_url': sThumbnailSrc});
      break;

      case 'vimeo':
        var sThumbnailSrc;
        // Ajax call for Vimeo thumbnail
        $.ajax({
          url: 'http://vimeo.com/api/v2/video/' + sEmbedCode + '.json',
        }).done(function ( data ) {
            sThumbnailSrc = data[0]['thumbnail_large'];
            self._$video_container.css('background-image', 'url("' + sThumbnailSrc + '")');
            oLocalDispatcher.publish('media_async_image', {'img_url': sThumbnailSrc});
        });
      break;

      case 'dailymotion':
        var sThumbnailSrc = 'http://www.dailymotion.com/thumbnail/video/' + sEmbedCode;
        self._$video_container.css('background-image', 'url("' + sThumbnailSrc + '")');
        oLocalDispatcher.publish('media_async_image', {'img_url': sThumbnailSrc});
      break;
    }

  },

  $ : function() {
    return this._$video_container;
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
        var $video = $('<iframe width="501" height="325" src="' + sEmbedUrl + '" frameborder="0" allowfullscreen></iframe>');
        this._$video_container.append($video);
      break;

      case 'vimeo':
        var sEmbedUrl = "http://player.vimeo.com/video/" + sEmbedCode
          + "?title=1&byline=0&portrait=0&autoplay=1";
        var $video = $('<iframe width="501" height="325" src="'+ sEmbedUrl +'" frameborder="0" webkitAllowFullscreen></iframe>');
        this._$video_container.append($video);
      break;

      case 'dailymotion':
        var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
            + sEmbedCode
            + "?background=3E3E3E&foreground=EEEEEE&highlight=5bab7d&autoplay=1";
        var $video = $('<iframe width="501" height="325" src="'+ sEmbedUrl +'" frameborder="0"></iframe>');
        this._$video_container.append($video);
      break;
    }
  },

  purge : function() {
    this._oLocalDispatcher = null;
    this._$video_container.empty().remove();
    this._$video_container = null;
  }


});