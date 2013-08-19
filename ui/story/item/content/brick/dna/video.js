'use strict';

/**
 * Video : brick that allows to insert a video.
 */
Cotton.UI.Story.Item.Content.Brick.Dna.Video = Class.extend({

  _sEmbedCode : null,
  _sVideoType : null,

  _$video : null,

  init : function(sEmbedCode, sVideoType) {
    var self = this;
    this._sEmbedCode = sEmbedCode;
    this._sVideoType = sVideoType;

    this._$video_container = $('<div class="video_container"></div>');

    // video
    // Uses the right embed code depending on the video provider
    if (this._sVideoType == "youtube") {
      this._$play = $('<div class="video_play"><div>').click(function(){
        self.loadVideo();
      });
      this._$thumbnail = $('<img class="resize thumbnail" src="http://img.youtube.com/vi/'
        + sEmbedCode + '/hqdefault.jpg" />').click(function(){
          self.loadVideo();
      });
      this._$video_container.append(this._$thumbnail, this._$play);
      this.resize(this._$thumbnail);

    } else if (this._sVideoType == "vimeo") {
      var thumbnail_src;
      // Ajax call for Vimeo thumbnail
      $.ajax({
        url: 'http://vimeo.com/api/v2/video/' + sEmbedCode + '.json',
      }).done(function ( data ) {
          thumbnail_src = data[0]['thumbnail_large'];
          self._$play = $('<div class="video_play"><div>').click(function(){
            self.loadVideo();
          });
          self._$thumbnail = $('<img class="resize thumbnail" src="' + thumbnail_src + '"/>').click(function(){
            self.loadVideo();
          });
          self._$video_container.append(self._$thumbnail, self._$play);
          self.resize(self._$thumbnail);
      });

    } else if (this._sVideoType == "dailymotion") {
      self._$play = $('<div class="video_play"><div>').click(function(){
        self.loadVideo();
      });
      this._$thumbnail = $('<img class="resize thumbnail" src="http://www.dailymotion.com/thumbnail/video/'
        + sEmbedCode + '"/>').click(function(){
          self.loadVideo();
      });
      self._$video_container.append(self._$thumbnail, self._$play);
      self.resize(self._$thumbnail);
    }

  },

  $ : function() {
    return this._$video_container;
  },

  /**
   * Resize the image so it fits perfectly in the container.
   * @param {DOM} $img:
   *  dom img element you want to resize.
   */
  resize : function($img) {
    $img.load(function(){
      //image size and ratio
      var iImWidth = $img.width();
      var iImHeight = $img.height();
      var fImRatio = iImWidth/iImHeight;

      //div size and ratio
      var iDivWidth = $img.parent().width();
      var iDivHeight = $img.parent().height();
      var fDivRatio = iDivWidth/iDivHeight;

      //center image according on how it overflows
      //if vertical, keep the upper part more visible
      if (fImRatio > fDivRatio) {
        $img.css('height',iDivHeight);
        var iOverflow = $img.width()-iDivWidth;
        $img.css('left',-iOverflow*0.5);
      } else {
        $img.css('width',iDivWidth);
        var iOverflow = $img.height()-iDivHeight;
        $img.css('top',-iOverflow*0.25);
      }
      $img.addClass('show');
    });
  },

  loadVideo : function(){
    switch (this._sVideoType){
      case 'youtube':
        var sEmbedUrl = "http://www.youtube.com/embed/" + this._sEmbedCode + "?autoplay=1";
        this._$video = $('<iframe width="360" height="260" src="' + sEmbedUrl + '" frameborder="0" allowfullscreen></iframe>');
        this._$thumbnail.removeClass('show').addClass('hidden');
        this._$play.addClass('hidden');
        this._$video_container.append(this._$video)
      break;

      case 'vimeo':
        var sEmbedUrl = "http://player.vimeo.com/video/" + this._sEmbedCode
          + "?title=1&byline=0&portrait=0&autoplay=1";
        this._$video = $('<iframe width="360" height="260" src="'+ sEmbedUrl +'" frameborder="0" webkitAllowFullscreen></iframe>');
        this._$video.attr('src', sEmbedUrl);
        this._$thumbnail.removeClass('show').addClass('hidden');
        this._$play.addClass('hidden');
        this._$video_container.append(this._$video)
      break;

      case 'dailymotion':
        var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
            + this._sEmbedCode
            + "?background=3E3E3E&foreground=EEEEEE&highlight=5bab7d&autoplay=1";
        this._$video = $('<iframe width="360" height="260" src="'+ sEmbedUrl +'" frameborder="0"></iframe>');
        this._$thumbnail.removeClass('show').addClass('hidden');
        this._$play.addClass('hidden');
        this._$video_container.append(this._$video);
      break;
    }
  }

});
