'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Item.Element = Class.extend({

  // parent element.
  _oStory : null,

  _sType : null,

  // current element.
  _$item : null,

  // sub elements.
  _$content : null,

  init : function(oDispacher, oStoryElement) {
    var self = this;
    this._oDispacher = oDispacher;
    this._oStoryElement = oStoryElement;
    // current element.
    this._$item = $('<div class="ct-story_item"></div>');

    // current sub elements.
    this._$content = $('<div class="ct-item_content"></div>');

  },

  $ : function() {
    return this._$item;
  },

  dispacher : function() {
    return this._oDispacher;
  },

  story : function() {
    return this._oStoryElement;
  },

  type : function() {
    return this._sType;
  }

});
