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

  _oItemFeaturedImage : null,
  _oItemInfo : null,
  _oItemSummaryInfo : null,
  _oItemMenu : null,
  _oItemLargeMenu : null,
  _oItemDna : null,

  init : function(oItem) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_content = this._oItem.$();

    //     this._oItemFeaturedImage = new Cotton.UI.Story.Item.FeaturedImage(this);
    //     this._oItemInfo = new Cotton.UI.Story.Item.Info(this);
    //     this._oItemSummaryInfo = new Cotton.UI.Story.Item.SummaryInfo(this);
    //     this._oItemMenu = new Cotton.UI.Story.Item.Menu(this);
    //     this._oItemLargeMenu = new Cotton.UI.Story.Item.LargeMenu(this);
    //     this._oItemDna = new Cotton.UI.Story.Item.Dna(this);

    // the construction of the element depends on the its type. So create the
    // element directly in the sub class.
  },

  $ : function(){
    return this._$item_content;
  },

  item : function(){
    return this._oItem;
  },

  itemInfo : function(){
	  return this._oItemInfo;
  },

  appendTo : function(oStoryLine) {
    this._oItem.$().append(this._$item_content);
  },

});

