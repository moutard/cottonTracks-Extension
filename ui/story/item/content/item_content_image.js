'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Image = Class.extend({

  _oItem : null,

  _$item_content : null,

  _$featured_image : null,
  _$img : null,
  _oItemToolbox : null,

  init : function(oItem, sType) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_content = $('<div class="ct-item_content"></div>');

    // current sub elements.
    this._$featured_image = $('<div class="ct-featured_image"></div>');
    this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);

    this._$img = $('<img ></img>');

    if (sType === "img") {
      this._$img.attr("src", this._oItem._oVisitItem.url());
    }
    if (sType === "imgres") {
      this._$img.attr("src", this._oItem._oVisitItem._oUrl.dSearch['imgurl']);
    }
    this._$featured_image.append(this._$img);

    // create the item
    this._$item_content.append(this._$featured_image, this._oItemToolbox.$());
  },

  $ : function() {
    return this._$item_content;
  },

  item : function(){
    return this._oItem;
  },

  appendTo : function(oItem) {
    oItem.$().append(this._$item_content);
  },

});
