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

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oGlobalDispatcher.subscribe('show_tags', this, function(dArguments){
      for (var key in dArguments['tags']) {
        var $occurence_tag = $('<div class="ct-occurence_tag"></div>').text(key+' : '+dArguments['tags'][key]);
        this._$epitome.append($occurence_tag);
      }
    })
  },

  $ : function() {
    return this._$epitome;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('show_tags', this);
    this._oGlobalDispatcher = null;
    this._$epitome.remove();
    this._$epitome = null;
  }

});
