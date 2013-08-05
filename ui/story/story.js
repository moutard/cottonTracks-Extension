'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Element = Class.extend({

  /**
   * {Cotton.Model.Story} _oStory
   */
  _oStory : null,

  /**
   * {Array.<Cotton.UI.Story.Item.Element>}
   */
  _lDOMItems : [],

  /**
   * { Cotton.UI.Story.Item.AddItem} _oAddItems: specific view to add item to
   * a story.
   */
  _oAddItems : null,

  // current element.
  _$story : null,
  _$itemsContainer : null,

  /**
   * FIXME(rmoutard->rkorache): add a comment to describe this value.
   * {Boolean} _bScrolledStory:
   */
  _bScrolledStory : null,

  /**
   * FIXME(rmoutard->rkorache): add a comment to describe this value.
   * {String} _sActiveFilter:
   */
  _sActiveFilter : null,

  init : function(oStory, oDispatcher) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oStory = oStory;
    this._lItems = [];
    this._sActiveFilter = '*';

    this._$story = $('<div class="ct-story"></div>').scroll(function() {
      if (!self._bScrolledStory) {
        Cotton.ANALYTICS.scrollStory();
        self._bScrolledStory = true;
      }
    });
    this._$itemsContainer = $('<div class="ct-items_container"></div>');
    // Create element.
    this._$story.append(
      this._$itemsContainer
    );

    // Fill the story with the historyItems.
    var dFilters = {};
    var lHistoryItems = oStory.historyItems();

    this.placeItems(lHistoryItems, dFilters, function(dFilters) {
      // Put the "add element block at the end of the story".
      self._oAddItems = new Cotton.UI.Story.Item.AddItem(self._oDispatcher, self);
      self._$itemsContainer.isotope('insert', self._oAddItems.$());
    });

    this._oDispatcher.subscribe('story:filter', this, function(dArguments) {
      // Show only the elements that have this data-filter.
       this._$itemsContainer.isotope({
         'filter': dArguments['filter']
       });
       this._sActiveFilter = dArguments['filter'];
    });

    this._oDispatcher.subscribe('relayout', this, function(dArguments) {
      // Need to recompute the grid.
      self._$itemsContainer.isotope('reLayout');
    });

    // Delete element
    this._oDispatcher.subscribe("database:item_deleted", this, function(dArguments) {
      for (var i = 0, iLength = self._lDOMItems.length; i < iLength; i++) {
        var $item = self._lDOMItems[i];
        if ($item.attr('id') == dArguments['id']) {
          self.removeDOMItem(i, $item);
        }
      }
    });

    // back to story
    this._oDispatcher.subscribe('back_to_story', this, function(dArguments) {
      this.show();
    });

  },

  $ : function() {
    return this._$story;
  },

  itemsContainer : function() {
    return this._$itemsContainer;
  },

  addHistoryItem : function(oHistoryItem) {
    var oItemElement = new Cotton.UI.Story.Item.Factory(oHistoryItem,
      this._sActiveFilter,
      this._oDispatcher);
    this._$itemsContainer.isotope('insert', oItemElement.$());
    this._lDOMItems.push(oItemElement.$());
    this._oDispatcher.publish('element:added', {
      'type': oItemElement.type()
    });
  },

  recycleItem : function(oHistoryItem) {
    for (var i = 0, iLength = this._lItems.length; i < iLength; i++) {
      var oItem = this._lItems[i];
      if (oItem.historyItem().id() === oHistoryItem.id()
          && oItem.type() == 'article') {
        oItem.recycle(oHistoryItem);
      }
    }
  },

  removeDOMItem : function(iIndex, $item) {
    this._$itemsContainer.isotope('remove', $item, function(){});
  },

  initPlaceItems : function() {
    this._$itemsContainer.isotope({
      'itemSelector' : '.ct-story_item',
      'layoutMode' : 'fitColumns',
      'animationEngine' : 'css'
    });
  },

  /**
   * use placeItem to place them all.
   * FIXME(rmoutard->rkorach) : prefer to put all the element once to avoid useless refresh
   */
  placeItems : function(lHistoryItems, dFilters, mCallback) {
    if (lHistoryItems && lHistoryItems.length > 0) {
      this.placeItem(lHistoryItems, 0, dFilters,mCallback);
    }
  },

  /**
   * FIXME(rmoutard->rkorach): complex method can you add some comments.
   */
  placeItem : function(lHistoryItems, iPosition, dFilters, mCallback) {
    var self = this;
    this.initPlaceItems();
    if (lHistoryItems.length > iPosition) {
      var oHistoryItem = lHistoryItems[iPosition];
      var oItem = Cotton.UI.Story.Item.Factory(oHistoryItem,
        this._sActiveFilter, self._oDispatcher);
      this._lItems.push(oItem);
      dFilters[oItem.type()] = (dFilters[oItem.type()] || 0) + 1;
      self._oDispatcher.publish('update_filters', dFilters);
      self._lDOMItems.push(oItem.$());
      self._$itemsContainer.isotope('insert', oItem.$());
      setTimeout(function() {
        self.placeItem(lHistoryItems, iPosition + 1, dFilters, mCallback);
      }, 100);
    } else {
      if (mCallback) {
        mCallback.call(this, dFilters);
      }
    }
  },

  showItemsToAdd : function(lItemsFromPool) {
    this._oAddItems.showItems(lItemsFromPool);
  },

  hide : function() {
    this._$story.addClass('hidden');
  },

  show : function() {
    this._$story.removeClass('hidden');
    this._$itemsContainer.isotope('reLayout');
  }
});


