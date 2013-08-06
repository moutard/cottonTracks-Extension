'use strict';

/**
 * Item Date Contains clock icon and date
 */
Cotton.UI.Story.Item.Content.Brick.NavigationBar = Class.extend({

  _$navigation_bar : null,
  _oAddItem : null,

  init : function(oAddItem) {
    var self = this;
    // parent element
    this._oAddItem = oAddItem;

    this._$navigation_bar = $('<div class="navigation_bar"></div>');
    this._$previous_items_arrow = $('<img class="arrow previous_items"/>').click(function(){
      self._oAddItem.previous();
    });
    this._$next_items_arrow = $('<img class="arrow next_items"/>').click(function(){
      self._oAddItem.next();
    });

    this._$navigation_bar.append(
      this._$next_items_arrow,
      this._$previous_items_arrow
    )
  },

  $ : function() {
    return this._$navigation_bar;
  },

  refreshArrows : function(iPreviousItems, iNextItems){
    if (iPreviousItems > 0){
      this._$previous_items_arrow.attr('src', '/media/images/story/item/add_item/arrow.png');
      this._$previous_items_arrow.addClass('active');
    } else{
      this._$previous_items_arrow.attr('src', '/media/images/story/item/add_item/arrow_grey.png');
      this._$previous_items_arrow.removeClass('active');
    }
    if (iNextItems > 0){
      this._$next_items_arrow.attr('src', '/media/images/story/item/add_item/arrow.png');
      this._$next_items_arrow.addClass('active');
    } else{
      this._$next_items_arrow.attr('src', '/media/images/story/item/add_item/arrow_grey.png');
      this._$next_items_arrow.removeClass('active');
    }
  },

});
