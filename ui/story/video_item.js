'use strict';

Cotton.UI.Story.VideoItem = Class
    .extend({

      _oVisitItem : null,
      _$item : null,
      _$storyLink : null,

      init : function(oVisitItem, sVideoType, sEmbedCode) {
        this._oVisitItem = oVisitItem;
        this._sVideoType = sVideoType;

        this._$item = $('<div class="ct-storyItem ct-storyItem_left"></div>');
        var $content = $('<div class="ct-storyContent"></div>');
        var $deleteButton = $('<div class="ct-storyDelete"></div>');
        var $grabHandle = $('<div class="ct-storyGrab"></div>');
        var $featuredImage = $('<img class="ct-storyFeaturedImage" />');
        var $title = $('<h3></h3>');
        var $legend = $('<span class="ct-legend"></span>');
        var $summary = $('<p></p>');
        var $bottom = $('<div class="ct-item_bottom"></div>');
        var $quote = $('<div class="ct-quote"></div>');
        this._$storyLink = $('<div class="ct-storyItemLink"></div>');

        // Uses the right embed code depending on the video provider
        if (this._sVideoType == "youtube") {
          var $video = $('<iframe width="380" height="214" src="" frameborder="0" allowfullscreen></iframe>');
          var sEmbedUrl = "http://www.youtube.com/embed/" + sEmbedCode;
          $video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "vimeo") {
          var $video = $('<iframe width="380" height="214" src="" frameborder="0" webkitAllowFullscreen></iframe>');
          var sEmbedUrl = "http://player.vimeo.com/video/" + sEmbedCode
              + "?title=1&byline=0&portrait=0";
          $video.attr('src', sEmbedUrl);
        } else if (this._sVideoType == "dailymotion") {
          var $video = $('<iframe width="380" height="214" src="" frameborder="0"></iframe>');
          var sEmbedUrl = "http://www.dailymotion.com/embed/video/"
              + sEmbedCode
              + "?background=3E3E3E&foreground=EEEEEE&highlight=4EBBFF";
          $video.attr('src', sEmbedUrl);
        }

        // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
        var sUrl = oVisitItem.url();
        var oReg = new RegExp("\/\/([^/]*)\/");
        var sDomain = sUrl.match(oReg)[1];
        $legend.text(sDomain);

        var $originLink = $('<a />');
        $originLink.attr('href', sUrl).attr('target', '_blank').text(
            oVisitItem.title());
        $summary
            .append("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget fringilla quam. Fusce vitae erat sem, a lacinia nulla. Duis in nibh tellus. Mauris iaculis rutrum massa eu volutpat. Mauris posuere laoreet nibh non iaculis. Ut rhoncus orci vitae augue dictum et varius odio accumsan. Nulla malesuada ligula at nisi pellentesque eleifend. Fusce in metus et eros dignissim interdum a eget orci.");

        $featuredImage.attr("src", "/media/images/story_preview.png");
        $quote
            .text("Ut tristique porta rhoncus. In a quam posuere orci ultrices pretium at quis urna. Praesent pulvinar ullamcorper augue sed ultricies.");
        this._$item.append(this._$storyLink.append($(
            '<div class="ct-storyItemLinkLine"></div>').append(
            $('<div class="ct-storyItemLinkDot"></div>'))), $content
            .append($video), $bottom);

        // event tracking
        $video.click(function() {
          Cotton.ANALYTICS.viewVideo();
        });
      },

      $ : function() {
        return this._$item;
      },

      appendTo : function(oStoryLine) {
        oStoryLine.$().append(this._$item);
      },

      setTop : function(iTop) {
        this._$item.css({
          top : iTop
        });
      },

      setSide : function(sSide) {
        switch (sSide) {
        case 'left':
          this._$item.removeClass('ct-storyItem_right').addClass(
              'ct-storyItem_left');
          break;
        case 'right':
          this._$item.removeClass('ct-storyItem_left').addClass(
              'ct-storyItem_right');
          break;
        }
      }
    });
