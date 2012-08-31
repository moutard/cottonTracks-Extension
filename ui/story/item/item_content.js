'use strict';

/**
 * Item content
 * In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content = Class.extend({

  _oItem : null,

  _$item_content : null,

  _$featured_image : null,
  _oItemToolbox : null,
  _oItemDescription : null,
  _oItemDna : null,

  init : function(oItem) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_content = $('<div class="ct-item_content"></div>');

    // current sub elements.
    this._$featured_image = $('<div class="ct-featured_image"></div>');
    this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox();
    this._oItemDescription = new Cotton.UI.Story.Item.Description();
    this._oItemDna = new Cotton.UI.Story.Item.Dna();

    // create the item
    this._$item_content.append(
        this._$featured_image,
        this._oItemToolbox.$(),
        this._oItemDescription.$(),
        this._oItemDna.$()
    );
  },

  $ : function(){
    return this._$item_content;
  },

  appendTo : function(oStoryLine) {
    this._oItem.$().append(this._$item_content);
  },

});

