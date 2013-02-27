'use strict';

/**
 * Item content
 * Parent Class of
 * - item_content_default
 * - item_content_image
 * - item_content_map
 * ...
 */
Cotton.UI.Story.Item.Content.Element = Class.extend({

  /**
   * {Cotton.UI.Story.Item.Element} : parent.
   */
  _oItem : null,

  _$item_content : null,

  init : function(oItem) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_content = this._oItem.$();

    // the construction of the element depends on the its type. So create the
    // element directly in the sub class.
  },

  $ : function(){
    return this._$item_content;
  },

  item : function(){
    return this._oItem;
  }

});

