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
    var self = this;
    this._$default_add_text.addClass('hidden');
    this._$items_to_add = $('<div class="items_to_add"></div>');
    if (lItemsFromPool && lItemsFromPool.length > 3){
      this.appendNavigationBar();
    }
    var lDOMItems = [];
    for (var i = 0, oHistoryItem; oHistoryItem = lItemsFromPool[i]; i++){
      var $itemFromPool = this.domItemFromPool(oHistoryItem);
      var $title = ('<h3>' + oHistoryItem.title() + '</h3>');
      var oWebsite = new Cotton.UI.Story.Item.Content.Brick.Website(
        oHistoryItem.url());
      $itemFromPool.append(
        $title,
        oWebsite.$()
      );
      lDOMItems.push($itemFromPool);
    }
    this._$topmost_line = $('<div class="separation_line topmost"></div>');
    this._$bottommost_line = $('<div class="separation_line bottommost"></div>');
    this._$add_item.append(this._$items_to_add.append(
      lDOMItems,
      this._$topmost_line,
      this._$bottommost_line
    ));
  },

  appendNavigationBar : function(){
    this._$navigation_bar = $('<div class="navigation_bar"></div>');
    this._$next_items_arrow =
      $('<img class="arrow next_items" src="/media/images/story/item/add_item/arrow.png"/>');
    this._$previous_items_arrow =
      $('<img class="arrow previous_items" src="/media/images/story/item/add_item/arrow_grey.png"/>');
    this._$add_item.append(
      this._$navigation_bar.append(
        this._$next_items_arrow,
        this._$previous_items_arrow
      )
    );
  },

  domItemFromPool : function(oHistoryItem){
    var self = this;
    var $itemFromPool = $('<div class="item_from_pool"></div>').click(function(){
      self._oDispatcher.publish('add_historyItem', {'historyItem': oHistoryItem});
    });
    return $itemFromPool;
  },

});