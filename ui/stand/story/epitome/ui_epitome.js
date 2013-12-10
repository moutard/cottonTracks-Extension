"use strict";

/**
 * UIEpitome
 *
 * Represent the summary of the story.
 */
Cotton.UI.Stand.Story.Epitome.UIEpitome = Class.extend({

  /**
   * {DOM} current element
   */
  _$epitome : null,

  init : function(oStory, iRelatedStories, oGlobalDispatcher) {
    var self = this;

    this._$epitome = $('<div class="ct-epitome"></div>');
    for (var key in oStory.occurenceTags) {
      var $occurence_tag = $('<div class="ct-occurence_tag"></div>').text(key+' : '+oStory.occurenceTags[key]);
      this._$epitome.append($occurence_tag);
    }

  },

  $ : function() {
    return this._$epitome;
  },

  purge : function() {
    this._$epitome.remove();
    this._$epitome = null;
  }

});
