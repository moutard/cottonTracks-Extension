'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Item.Element = Class.extend({

  // parent element.
  _oStory : null,
  _oHistoryItem : null,

  _sType : null,

  // current element.
  _$item : null,

  // sub elements.
  _$content : null,

  init : function(oHistoryItem, sActiveFilter, oDispatcher) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oHistoryItem = oHistoryItem;
    this._sActiveFilter = sActiveFilter;
    // current element.
    this._$item = $('<div class="ct-story_item" id="' + this._oHistoryItem.id() + '"></div>');

    // current sub elements.
    this._$content = $('<div class="ct-item_content"></div>');
  },

  $ : function() {
    return this._$item;
  },

  dispatcher : function() {
    return this._oDispatcher;
  },

  historyItem : function() {
    return this._oHistoryItem;
  },

  setType : function(sType){
    this._sType = sType;
    this._$item.addClass(sType);
    if (this._sActiveFilter && this._sActiveFilter !== '*'
      && sType !== this._sActiveFilter.substring(1)){
        this._$item.addClass('isotope-hidden');
    }
    this._$content.addClass(sType);
  },

  type : function() {
    return this._sType;
  }

});
