"use strict";

/**
 * UICover
 *
 * Display a preview of the story in the shelf.
 */
Cotton.UI.Stand.Common.Cover.UICover = Class.extend({
  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * cover DOM element, contains the featured image of the stories
   * and links to the first historyItems of the story
   */
  _$cover : null,

  /**
   * {Cotton.UI.Stand.Common.Cover.Preview} Preview object
   **/
  _oPreview : null,

  /**
   * {Cotton.UI.Stand.Common.Sticker} Sticker object
   **/
  _oSticker : null,

  /**
   * @param {Cotton.Model.Story}
   *          oStory: data to display in the story.
   * @param {Cotton.Messaging.Dispatcher}
   *          oGlobalDispatcher:
   */
  init : function(oStory, oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$cover = $('<div class="ct-cover"></div>');

    // Frame containing the poster.
    this._$frame = $('<div class="ct-sticker_frame"></div>');

    // The sticker is the left part of the cover, with the image and the title.
    this._oSticker = new Cotton.UI.Stand.Common.Sticker(oStory, 'cover', oGlobalDispatcher);

    // Cross to delete the story.
    this._$delete = $('<div class="ct-delete_cover">Delete</div>');

    // The preview is the right part of the cover
    // with the 5 first links displayed and images on top
    this._oPreview = new Cotton.UI.Stand.Common.Cover.Preview(oStory,
        oGlobalDispatcher);

    this._$cover.append(
      this._$frame.append(
        this._oSticker.$(),
        this._$delete
      ),
      this._oPreview.$()
    );
  },

  $ : function() {
    return this._$cover;
  },

  /**
   * positions a cover on the manager
   **/
  setPosition : function(iTop, iLeft) {
    this._$cover.css({'top':iTop, 'left': iLeft});
  },

  setIndex : function(iIndex) {
    // have the first covers on top of z-index because you want the ones that move
    // on resize to be behind
    this._$cover.css('z-index', -iIndex);
  },

  animate : function() {
    this._$cover.addClass('ct-animate');
  },

  purge : function () {
    this._oSticker.purge();
    this._oSticker = null;
    this._$delete.remove();
    this._$delete = null;
    this._$frame.remove();
    this._$frame = null;
    this._oPreview.purge();
    this._oPreview = null;
    this._$cover.unbind('click');
    this._$cover.remove();
    this._$cover = null;
  }

});