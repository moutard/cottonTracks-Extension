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
  _oItemToolbox : null,
  _oItemDescription : null,
  _oItemDna : null,
  _bIsEditable : false,

  init : function(oItem) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_content = $('<div class="ct-item_content"></div>');

    this._oItemFeaturedImage = new Cotton.UI.Story.Item.FeaturedImage(this);
    this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);
    this._oItemDescription = new Cotton.UI.Story.Item.Description(this);
    this._oItemDna = new Cotton.UI.Story.Item.Dna(this);

    // the construction of the element depends on the its type. So create the
    // element directly in the sub class.
  },

  $ : function(){
    return this._$item_content;
  },

  item : function(){
    return this._oItem;
  },

  appendTo : function(oStoryLine) {
    this._oItem.$().append(this._$item_content);
  },

  editable : function(){
    var self = this;
    if(self._bIsEditable === false){
      self._bIsEditable = true;
      self._oItemDescription.editTitle();
      self._oItemFeaturedImage.editImage();
      self._oItemToolbox.addRemoveButton();
    } else {
      self._bIsEditable = false;
      self._oItemDescription.editTitle(true);
      self._oItemFeaturedImage.stopEditImage();
      self._oItemToolbox.removeRemoveButton();
    }

  },
});

