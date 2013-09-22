"use strict";

/**
 * UICover
 *
 * Display a preview of the story in the shelf.
 */
Cotton.UI.Stand.Common.Cover.UICover = Class.extend({

  /**
   * @param {Cotton.Model.Story}
   *          oStory: data to display in the story.
   * @param {Cotton.Messaging.Dispatcher}
   *          oGlobalDispatcher:
   */
  init : function(oStory, oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$cover = $('<div class="ct-cover"></div>').click(function(){
      oGlobalDispatcher.publish('enter_story', {
        'story': oStory
      });
    });

    // Frame containing the cover.
    this._$frame = $('<div class="ct-cover_sticker_frame"></div>');

    // Cross to delete the story.
    this._$delete = $('<div class="ct-delete_cover">Delete</div>');

    this._$cover.append(
      this._$frame.append(
        this._$delete
      )
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
    this._$cover.unbind('click');
    this._$cover.remove();
  }

});
