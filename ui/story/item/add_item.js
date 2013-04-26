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
  _$default_add_text : null,
  _$items_from_pool : null,
  _oNavigationBar : null,


  init : function(oDispatcher, oStoryElement) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oStoryElement = oStoryElement;

    // init value
    this._$add_item = $('<div class="ct-story_item ct-add_item"></div>');
    this._$default_add_text = $('<p>+ ADD A NEW ELEMENT</p>').click(function(){
      self._oDispatcher.publish('show_elements', {});
    });

    // create element
    this._$add_item.append(this._$default_add_text);

    this._oDispatcher.subscribe('add_historyItem_from_pool', this, function(dArguments){
      self.updateList();
    });
  },

  $ : function() {
    return this._$add_item;
  },

  showItems : function(lItemsFromPool) {
    var self = this;

    this._$default_add_text.addClass('hidden');
    this._$constrainer = $('<div class="constrainer"></div>');
    this._$items_from_pool = $('<div class="items_from_pool"></div>');
    this._iCurrentItems = 0;
    this._iPreviousItems = 0;
    this._iNextItems = 0;

    if (!lItemsFromPool || lItemsFromPool.length === 0){
      this.noItems();
    } else {

      this.appendNavigationBar();

      this._$add_item.append(
        this._$constrainer.append(
          this._$items_from_pool
        )
      );
      for (var i = 0, oHistoryItem; oHistoryItem = lItemsFromPool[i]; i++){
        var $pool_item = this.domItemFromPool(oHistoryItem);
        this._$items_from_pool.append($pool_item);
        if (i < 3){
          this._iCurrentItems++;
        } else {
          this._iNextItems++;
        }
      }
      this._oNavigationBar.refreshArrows(this._iPreviousItems, this._iNextItems);
    }
  },

  appendNavigationBar : function(){
    this._oNavigationBar = new Cotton.UI.Story.Item.Content.Brick.NavigationBar(this);
    this._$add_item.append(
      this._oNavigationBar.$()
    );
  },

  previous : function(){
    if (this._iPreviousItems > 0){
      this._iPreviousItems -= 3;
      this._iNextItems += this._iCurrentItems;
      this._iCurrentItems = 3;
      this._$items_from_pool.css('top', -this._iPreviousItems * 50);
    }
    this._oNavigationBar.refreshArrows(this._iPreviousItems, this._iNextItems);
  },

  next : function(){
    if (this._iNextItems > 0){
      this._iCurrentItems = Math.min(3, this._iNextItems);
      this._iNextItems -= this._iCurrentItems;
      this._iPreviousItems += 3;
      this._$items_from_pool.css('top', -this._iPreviousItems * 50);
    }
    this._oNavigationBar.refreshArrows(this._iPreviousItems, this._iNextItems);
  },

  domItemFromPool : function(oHistoryItem){
    var self = this;
    var oPoolItem = new Cotton.UI.Story.Item.Content.Brick.PoolItem(oHistoryItem, this._oDispatcher)
    return oPoolItem.$();
  },

  updateList : function(){
    if (this._iNextItems === 0){
      this._iCurrentItems--;
    }
    this._iNextItems -= Math.min(1, this._iNextItems);
    this._oNavigationBar.refreshArrows(this._iPreviousItems, this._iNextItems);
    if (this._iCurrentItems === 0 && this._iPreviousItems === 0){
      // No more element in pool
      this._$constrainer.addClass('hidden');
      this._oNavigationBar.$().addClass('hidden');
      this.noItems();
    } else if (this._iCurrentItems === 0){
      this.previous();
    }
  },

  noItems : function(){
    this._$no_items = $('<p>No new element to add</p>');
    this._$add_item.append(this._$no_items);
  }
});