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
    this._$title = $('<div class="ct-sticker_title" contenteditable="true"></div>').text(oStory.title()).blur(
      function(){
        if (!$(this).text()) {
          // blank title, we put back the previous title.
          $(this).text(oStory.title());
        } else if ($(this).text() !== oStory.title()){
          // we set the new title only if there has been a change in the title
          oStory.setTitle($(this).text())
          oGlobalDispatcher.publish('change_title', {
            'story_id': oStory.id(),
            'title': $(this).text()
          });
          // Analytics tracking.
          Cotton.ANALYTICS.editTitle(sContext);
        }
      }).keydown(function(e){
        if (e.keyCode === 13) {
          // 'enter' key, blur the title field
          $(this).blur();
        } else if (e.keyCode === 27) {
          // 'escape' key, set the title back to original
          // and blur the title field
          $(this).text(oStory.title());
          $(this).blur();
        }
      });

    // featuredImage. Because we resize it we use the
    // Cotton.UI.Stand.Common.Content.Image class we cannot use var oImage then
    // release it when it creates the dom element because there are the
    // asynchronous 'error' and 'load' events.
    this._oImage = new Cotton.UI.Stand.Common.Content.BImage();
    var sImageUrl = oStory.featuredImage();
    if (!sImageUrl || sImageUrl === "") {
      var iId = oStory.id() % 6 + 1;
      this._oImage.appendDefault(iId);
    } else {
      this._oImage.appendImage(sImageUrl);
    }


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

        self._oGlobalDispatcher.publish('push_state', {
          'code': '?sid=',
          'value': oStory.id()
        });
        self._oGlobalDispatcher.publish('enter_story', {
          'story': oStory
        });
      }
    });

    this._oGlobalDispatcher.subscribe('change_title', this, function(dArguments){
      if (oStory.id() === dArguments['story_id']) {
        oStory.setTitle(dArguments['title'])
        this._$title.text(dArguments['title']);
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
    this._oGlobalDispatcher.unsubscribe('change_title', this);
    this._oGlobalDispatcher = null;
    this._oImage.$().unbind('click');
    this._oImage.purge();
    this._oImage = null;
    // blur in case it was being edited
    this._$title.blur().remove();
    this._$title = null;
    this._$sticker.remove();
    this._$sticker = null;
  }

});
