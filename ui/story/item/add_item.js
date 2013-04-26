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
    this._$constrainer = $('<div class="constrainer"></div>');
    this._$items_from_pool = $('<div class="items_from_pool"></div>');
    this._iCurrentItems = 0;
    this._iPreviousItems = 0;
    this._iNextItems = 0;

    if (!lItemsFromPool || lItemsFromPool.length ===0 ){
      this.noItems();
    } else {

      this.appendNavigationBar();

      this._$add_item.append(
        this._$constrainer.append(
          this._$items_from_pool
        )
      );
      for (var i = 0, oHistoryItem; oHistoryItem = lItemsFromPool[i]; i++){
        var $itemFromPool = this.domItemFromPool(oHistoryItem);
        var $title = ('<h3>' + oHistoryItem.title() + '</h3>');
        var oWebsite = new Cotton.UI.Story.Item.Content.Brick.Website(
          oHistoryItem.url());
        $itemFromPool.append(
          $title,
          oWebsite.$()
        );
        this._$items_from_pool.append($itemFromPool);
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
    var $itemFromPool = $('<div class="pool_item"></div>').click(function(){
      self._oDispatcher.publish('add_historyItem', {'historyItem': oHistoryItem});
      $(this).addClass('collapsed');
      setTimeout(function(){
        $itemFromPool.addClass('hidden');
      }, 400);
      self._iCurrentItems--;
      self._iNextItems -= Math.min(1, self._iNextItems);
      self._oNavigationBar.refreshArrows(self._iPreviousItems, self._iNextItems);
      if (self._iCurrentItems === 0 && self._iPreviousItems === 0){
        // No more element in pool
        self._$constrainer.addClass('hidden');
        self._oNavigationBar.$().addClass('hidden');
        self.noItems();
      } else if (self._iCurrentItems === 0){
        self.previous();
      }
    });
    return $itemFromPool;
  },

  noItems : function(){
    this._$no_items = $('<p>No new element to add</p>');
    this._$add_item.append(this._$no_items);
  }
});