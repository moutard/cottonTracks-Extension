'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Search = Class.extend({

  _oItem : null,

  _$item_content : null,

  _$featured_image : null,
  _$img : null,
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
    this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);
    this._oItemDescription = new Cotton.UI.Story.Item.Description(this);
    this._oItemDna = new Cotton.UI.Story.Item.Dna(this);

    // set favicon
    this._oItemToolbox._$favicon.attr("src",
        "/media/images/story/google_favicon.png");

    // set image
    this._$img = $('<img ></img>');
    if(this._oItem.visitItem().extractedDNA().imageUrl() !== ""){
      this._$img.attr('src', this._oItem.visitItem().extractedDNA().imageUrl());
      this._$featured_image.append(this._$img);

    }

    // create the item
    this._$item_content.append(
        this._$featured_image,
        this._oItemDescription.$(),
        this._oItemToolbox.$()
        );
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
