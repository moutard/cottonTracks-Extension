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
  _lItems : [],

  _oAddItems : null,

  // current element.
  _$story : null,
  _$itemsContainer : null,

  //
  _bScrolledStory : null,

  init : function(oStory, oDispatcher) {
    var self = this;
    this._oDispatcher = oDispatcher;
    this._oStory = oStory;
    this._lItems = [];
    this._bScrolled = false;

    this._$story = $('<div class="ct-story"></div>').scroll(function(){
      if (!self._bScrolledStory){
        Cotton.ANALYTICS.scrollStory();
        self._bScrolledStory = true;
      }
    });
    this._$itemsContainer = $('<div class="ct-items_container"></div>');

    // Fill the story with the historyItems.
    var lDOMItems = [];
    var dFilters = {};
    var lHistoryItems = oStory.historyItems();
    for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      var oItem = Cotton.UI.Story.Item.Factory(oHistoryItem,
        this._oDispatcher, this);
      dFilters[oItem.type()] = (dFilters[oItem.type()] || 0) + 1;
      this._lItems.push(oItem);
      // create a temp array that will be passed as jQuery.
      // jQuery use documentFragment to append array to the DOM making this
      // operation faster to avoid the reflow.
      lDOMItems.push(oItem.$());
    }
    // put the "add element block at the end of the story"
    this._oAddItems = new Cotton.UI.Story.Item.AddItem(self._oDispatcher, this);
    lDOMItems.push(this._oAddItems.$());

    this._oDispatcher.publish('update_filters', dFilters);

    this._oDispatcher.subscribe('story:filter', this, function(dArguments){
      // Show only the elements that have this data-filter.
       this._$itemsContainer.isotope({
         'filter': dArguments['filter']
       });
    });
    this._oDispatcher.subscribe('item:expand', this, function(dArguments){
      // Need to recompute the grid.
      self._$itemsContainer.isotope('reLayout');
    });

    // Delete element
    this._oDispatcher.subscribe("item:delete", this, function(dArguments){
      for (var i = 0, iLength = lDOMItems.length; i < iLength; i++){
        var $item = lDOMItems[i];
        if ($item.attr('id') == dArguments['id']){
          self.removeDOMItem(i, $item);
        }
      }
    });
    // Create element.
    this._$story.append(
      this._$itemsContainer.append(lDOMItems)
    );

  },

  $ : function() {
    return this._$story;
  },

  itemsContainer : function() {
    return this._$itemsContainer;
  },

  addHistoryItem : function(oHistoryItem) {
    var oItemElement = new Cotton.UI.Story.Item.Element(oDispatcher, oHistoryItem);
    this._$itemsContainer.append(oItemElement);
  },

  recycleItem : function(oHistoryItem) {
    for (var i = 0, iLength = this._lItems.length; i < iLength; i++) {
      var oItem = this._lItems[i];
      if (oItem.historyItem().id() === oHistoryItem.id() && oItem.type() == 'article'){
        oItem.recycle(oHistoryItem);
      }
    }
  },

  removeDOMItem : function(iIndex, $item) {
    this._$itemsContainer.isotope('remove', $item, function(){});
  },

  initPlaceItems: function() {
    this._$itemsContainer.isotope({
      'itemSelector' : '.ct-story_item',
      'layoutMode' : 'fitColumns'
    });
  },

  update : function() {
    this._$itemsContainer.isotope({});
  },

  showItemsToAdd : function(lItemsFromPool) {
    this._oAddItems.showItems(lItemsFromPool);
  }

});


