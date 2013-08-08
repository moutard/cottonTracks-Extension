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

  /**
   * {DOM} parameters button
   **/
  _$params : null,

  /**
   * {DOM} related stories button
   **/
  _$related : null,


  init : function(oStory, oGlobalDispatcher) {
    this._$epitome = $('<div class="ct-epitome"></div>');

    this._$related = $('<div class="ct-epitome_button related_button">Related Stories</div>');

    this._$epitome.append(this._$related);
  },

  $ : function() {
    return this._$epitome;
  },

  purge : function() {
    this._$related.remove();
    this._$related = null;
    this._$epitome.remove();
    this._$epitome = null;
  }

});
