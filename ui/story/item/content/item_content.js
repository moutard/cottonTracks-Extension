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
   * {Cotton.UI.Story.Item.Element}  parent
   */
  _oItem : null,

  /**
   * DOM element
   */
  _$content : null,

  /**
   * {Cotton.Model.HistoryItem} oHistoryItem
   */
  _oHistoryItem : null,

  /**
   * @param {Cotton.Model.HistoryItem} oHistoryItem
   * @param {Cotton.UI.Story.Item} oItem
   */
  init : function(oHistoryItem, oItem) {
    // current parent element.
    this._oItem = oItem;

    // oHistoryItem that contains all the content data.
    this._oHistoryItem = oHistoryItem;

    // current item.
    this._$content = this._oItem.$();

    // the construction of the element depends on the its type. So create the
    // element directly in the sub class.
  },

  $ : function(){
    return this._$content;
  },

  item : function(){
    return this._oItem;
  }

});

