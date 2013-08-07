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
    var oDate = new Date(oStory.lastVisitTime());
    this._$cover = $('<div class="ct-cover">' + oDate + '</div>').click(function(){
      oGlobalDispatcher.publish('enter_story', {
        'story': oStory
      });
    });
  },

  $ : function() {
    return this._$cover;
  },

  purge : function () {
    this._$cover.unbind('click');
    this._$cover.remove();
  }

});
