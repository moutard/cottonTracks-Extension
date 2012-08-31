'use strict';

/**
 * Item toolbox
 * In the UI V2, item toolbox correponds to the block that contains the date
 * and the favicon. This toolbox is always present in all the
 * story_items.
 */
Cotton.UI.Story.Item.Toolbox = Class.extend({

  _oItem : null,

  _$item_toolbox : null,

  _$date : null,
  _$favicon : null,
  _$edit_button : null,
  _$lock_button : null,

  init : function(oItem) {
    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$item_toolbox = $('<div class="ct-item_toolbox"></div>');

    // current sub elements.
    this._$date = $('<div class="ct-date"></div>');
    this._$favicon = $('<div class="ct-favicon"></div>');
    this._$edit_button = $('<div class="ct-edit_button"></div>');
    this._$lock_button = $('<div class="ct-lock_button"></div>');

    // set the value
    this._$date.text('29 jan');
    this._$favicon.append('<img src="/media/images/story/default_favicon.png">');
    this._$edit_button.append('<img src="/media/images/story/default_favicon.png">');
    this._$lock_button.append('<img src="/media/images/story/default_favicon.png">');

    // create the item
    this._$item_toolbox.append(
        this._$date,
        this._$favicon,
        this._$edit_button,
        this._$lock_button
    );
  },

  $ : function(){
    return this._$item_toolbox;
  },

  appendTo : function(oStoryLine) {
    this._oItem.$().append(this._$item_toolbox);
  },

});

