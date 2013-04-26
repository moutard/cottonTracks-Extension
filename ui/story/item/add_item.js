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

    if (lItemsFromPool && lItemsFromPool.length > 3){
      this.appendNavigationBar();
    }

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
    this.refreshArrows();
  },

  appendNavigationBar : function(){
    var self = this;
    this._$navigation_bar = $('<div class="navigation_bar"></div>');
    this._$previous_items_arrow = $('<img class="arrow previous_items"/>').click(function(){
      if (self._iPreviousItems > 0){
        self._iPreviousItems -= 3;
        self._iNextItems += self._iCurrentItems;
        self._iCurrentItems = 3;
        self._$items_from_pool.css('top', -self._iPreviousItems * 50);
      }
      self.refreshArrows();
    });
    this._$next_items_arrow = $('<img class="arrow next_items"/>').click(function(){
      if (self._iNextItems > 0){
        self._iCurrentItems = Math.min(3, self._iNextItems);
        self._iNextItems -= self._iCurrentItems;
        self._iPreviousItems += 3;
        self._$items_from_pool.css('top', -self._iPreviousItems * 50);
      }
      self.refreshArrows();
    });
    this._$add_item.append(
      this._$navigation_bar.append(
        this._$next_items_arrow,
        this._$previous_items_arrow
      )
    );
  },

  refreshArrows : function(){
    if (this._iPreviousItems > 0){
      this._$previous_items_arrow.attr('src', '/media/images/story/item/add_item/arrow.png');
      this._$previous_items_arrow.addClass('active');
    } else{
      this._$previous_items_arrow.attr('src', '/media/images/story/item/add_item/arrow_grey.png');
      this._$previous_items_arrow.removeClass('active');
    }
    if (this._iNextItems > 0){
      this._$next_items_arrow.attr('src', '/media/images/story/item/add_item/arrow.png');
      this._$next_items_arrow.addClass('active');
    } else{
      this._$next_items_arrow.attr('src', '/media/images/story/item/add_item/arrow_grey.png');
      this._$next_items_arrow.removeClass('active');
    }
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
      self.refreshArrows();
    });
    return $itemFromPool;
  },

});