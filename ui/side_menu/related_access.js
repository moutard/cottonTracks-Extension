'use strict';

/**
 * Access button to related stories
 */

Cotton.UI.SideMenu.RelatedAccess = Class.extend({

  /**
   * {Cotton.UI.SideMenu.Menu} parent element.
   */
  _oMenu : null,

  /**
   * {Cotton.Messaging.Dispatcher} dispatcher for UI
   */
  _oDispatcher : null,

  _$related_access : null,

  init: function(iRelated, oDispatcher) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._$separationLine = $('<div class="separation_line"></div>');

    this._$related_access = $('<div class="ct-related_access toggle_state">Related stories ('
      + iRelated + ')</div>').click(function(){
        if (iRelated > 0){
          self._$related_access.addClass('hidden');
          self._$back_to_story.removeClass('hidden');
          self._oDispatcher.publish('related_stories', {});
        }
    });
    this._$back_to_story = $('<div class="ct-back_to_story toggle_state hidden">Back to story</div>').click(
      function(){
        self._$related_access.removeClass('hidden');
        self._$back_to_story.addClass('hidden');
        self._oDispatcher.publish('back_to_story', {});
    });

    this._$toggler = $('<div class="ct-toggler"></div>');

    this._$toggler.append(
      this._$separationLine,
      this._$related_access,
      this._$back_to_story
      )
  },

  $ : function(){
    return this._$toggler;
  }

});