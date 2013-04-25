'use strict';

/**
 * In charge of letting user add elements from the pool in the current story.
 */
Cotton.UI.Story.Item.AddItem = Class.extend({

  // parent element.
  _oStory : null,

  // dispatcher.
  _oDispatcher : null,

  _$add_item : null,

  init : function(oDispatcher, oStoryElement) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oStoryElement = oStoryElement;

    this._$add_item = $('<div class="ct-story_item ct-add_item"></div>');
    this._$default_add_text = $('<p>+ ADD A NEW ELEMENT</p>').click(function(){
      self._oDispatcher.publish('show_elements', {});
    });

    this._$add_item.append(this._$default_add_text);
  },

  $ : function() {
    return this._$add_item;
  },

  showItems : function(lItemsFromPool) {
    this._$default_add_text.addClass('hidden');
    if (lItemsFromPool && lItemsFromPool.length > 3){
      this.appendNavigationBar();
    }
  },

  appendNavigationBar : function(){
    this._$navigation_bar = $('<div class="navigation_bar"></div>');
    this._$next_items_arrow =
      $('<img class="arrow next_items" src="/media/images/story/item/add_item/arrow.png"/>');
    this._$previous_items_arrow =
      $('<img class="arrow previous_items" src="/media/images/story/item/add_item/arrow.png"/>').addClass('hidden');
    this._$add_item.append(
      this._$navigation_bar.append(
      )
    );
  }

});