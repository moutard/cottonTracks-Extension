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

  init : function(oDispatcher, oStoryElement) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oStoryElement = oStoryElement;
    // current element.
    this._$item = $('<div class="ct-story_item"></div>');

    // current sub elements.
    this._$content = $('<div class="ct-item_content"></div>');

  },

  $ : function() {
    return this._$item;
  },

  dispatcher : function() {
    return this._oDispatcher;
  },

  story : function() {
    return this._oStoryElement;
  },

  setType : function(sType){
    this._sType = sType;
    this._$content.addClass(sType);
  },

  type : function() {
    return this._sType;
  }

});
