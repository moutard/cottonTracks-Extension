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


  init : function(oStory) {
    this._$epitome = $('<div class="ct-epitome"></div>');
    this.setBackground(oStory);

    this._$related = $('<div class="ct-epitome_button related_button">Related Stories</div>');

    this._$epitome.append(this._$related);
  },

  $ : function() {
    return this._$epitome;
  },

  setBackground : function(oStory) {
    var iLength = oStory.historyItems().length;
    for (var i = 0; i < iLength; i++) {
      var historyItem = oStory.historyItems()[i];
      if (historyItem.extractedDNA().imageUrl()
        && historyItem.extractedDNA().imageUrl() !== oStory.featuredImage()) {
          this._$background = $('<div class="ct-epitome_background"></div>').css(
            'background-image', 'url("' + historyItem.extractedDNA().imageUrl() + '")');
          this._$epitome.prepend(this._$background);
          break;
      }
    }
  },

  purge : function() {
    if (this._$background) {
      this._$background.remove();
      this._$background = null;
    }
    this._$related.remove();
    this._$related = null;
    this._$epitome.remove();
    this._$epitome = null;
  }

});
