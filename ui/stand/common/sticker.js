"use strict";

Cotton.UI.Stand.Common.Sticker = Class.extend({

  /**
   * {DOM} sticker with the featured image and the title
   **/
  _$sticker : null,

  /**
   * {DOM} image of the sticker
   **/
  _$image : null,

  /**
   * {DOM} title of the sticker
   **/
  _$title : null,

  /**
   * {Cotton.UI.Stand.Common.Content.Image} image object that resizes in
   * its container
   **/
  _oImage : null,

  init : function(oStory, sContext, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    // Sticker, contains featuredImage and title.
    this._$sticker = $('<div class="ct-sticker"></div>');

    // Title of the story.
    this._$title = $('<div class="ct-sticker_title"></div>').text(oStory.title());

    // featuredImage. Because we resize it we use the
    // Cotton.UI.Stand.Common.Content.Image class we cannot use var oImage then
    // release it when it creates the dom element because there are the
    // asynchronous 'error' and 'load' events.
    this._oImage = new Cotton.UI.Stand.Common.Content.BImage();
    var sImageUrl = oStory.featuredImage();
    if (!sImageUrl || sImageUrl === "") {
      var iRand = Math.floor(Math.random() * 5) + 1;
      this._oImage.$().addClass('ct-image' + iRand);
    }
    this._oImage.appendImage(sImageUrl);


    // Click the image to enter the story.
    this._oImage.$().addClass('ct-sticker_image').click(function(){
      if (sContext === 'cover') {
        // analytics tracking
        Cotton.ANALYTICS.openStory('sticker');


        if (self._$sticker.parents().hasClass('ct-related_cover')){
          var sStoryContext = 'related';
        } else {
          var sStoryContext = 'manager';
        }
        // analytics tracking
        Cotton.ANALYTICS.storyContext(sStoryContext);

        self._oGlobalDispatcher.publish('enter_story', {
          'story': oStory
        });
      }
    });

    this._$sticker.append(
        this._oImage.$(),
        this._$title
    );
  },

  $ : function() {
    return this._$sticker;
  },

  purge : function() {
    this._oGlobalDispatcher = null;
    this._oImage.$().unbind('click');
    this._oImage.purge();
    this._oImage = null;
    this._$title = null;
    this._$sticker.remove();
    this._$sticker = null;
  }

});
