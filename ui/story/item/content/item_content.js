'use strict';

/**
 * Content
 */
Cotton.UI.Story.Item.Content.Element = Class.extend({

  /**
   * {Cotton.UI.Story.Item.Element} parent element
   */
  _oItem : null,

  /**
   * {DOM} current element
   */
  _$content : null,

  /**
   * {Cotton.Model.HistoryItem} oHistoryItem
   */
  _oHistoryItem : null,

  /**
   * {String} Type :
   */
  _sType : "default",

  /**
   * @param {Cotton.Model.HistoryItem} oHistoryItem
   * @param {Cotton.UI.Story.Item} oItem
   */
  init : function(oHistoryItem, oDispacher, oItem) {
    // current parent element.
    this._oItem = oItem;

    // oHistoryItem that contains all the content data.
    this._oHistoryItem = oHistoryItem;
    this._oDispacher = oDispacher;

    // current item.
    this._$content = $('<div class="ct-item_content"></div>');
    var oDNA = oHistoryItem.extractedDNA();
    var bHasExpand = ((oDNA.allParagraphs().length > 0)
      || (oDNA.paragraphs().length > 0)
      || (oDNA.firstParagraph() != ""));

    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Complexe(bHasExpand,
        oHistoryItem.url(), this._oDispacher, this);

    // the construction of the element depends on the its type. So create the
    // element directly in the sub class.
  },

  $ : function(){
    return this._$content;
  },

  item : function(){
    return this._oItem;
  },

  type : function() {
    return this._sType;
  }

});

