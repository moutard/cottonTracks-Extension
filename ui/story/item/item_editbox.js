'use strict';

/**
 * Item Editbox In the UI V2, item toolbox correponds to the block that contains
 * the date and the favicon. This toolbox is always present in all the
 * story_items.
 */
Cotton.UI.Story.Item.Editbox = Class.extend({

  _oItemToolbox : null,

  _$item_editbox : null,

  _$set_title_button : null,
  _$set_image_button : null,
  _$remove_button : null,

  _bIsOpen : false,

  init : function(oItemToolbox) {
    var self = this;

    // current parent element.
    this._oItemToolbox = oItemToolbox;

    //
    this._$item_editbox = $('<div class="ct-item_editbox"></div>');

    // current sub elements.
    this._$set_title_button = $('<div class="ct-text_button ct-set_title_button">Edit Title</div>');
    this._$set_image_button = $('<div class="ct-text_button ct-set_image_button">Edit Image</div>');
    this._$remove_button = $('<div class="ct-text_button ct-remove_button">Remove Item</div>');

    this._$set_title_button.click(function(){
    });
    this._$set_image_button.click(function(){
    });

    this._$remove_button.click(function(){
      // Send message to the controller.
      var iVisitItem = self.itemToolbox().contentItem().item().visitItem().id();
      Cotton.CONTROLLER.removeVisitItemInStory(iVisitItem);

      // Update the view.
      self.itemToolbox().contentItem().item().$().remove();
    });

    // create the item
    this._$item_editbox.append(
        this._$set_title_button,
        this._$set_image_button,
        this._$remove_button
    ).hide();
  },

  $ : function() {
    return this._$item_editbox;
  },

  itemToolbox : function(){
    return this._oItemToolbox;
  },

  openClose : function(){
    var self = this;
    if(self._bIsOpen){
      self.$().hide();
      self._bIsOpen = false;
    } else {
      self.$().show();
      self._bIsOpen = true;
    }
  },

  appendTo : function(oItemToolbox) {
    oItemToolbox.$().append(this._$item_editbox);
  },

});
