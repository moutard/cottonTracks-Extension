'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Item.Element = Class.extend({

  // parent element.
  _oWorld : null,

  _oHistoryItem : null,

  // current element.
  _$item : null,

  _sItemType : null,
  _oItemContent : null,
  _bReload : null,

  // sub elements.
  _$storyContainer : null,

  init : function(oHistoryItem, $storyContainer, oWorld) {
    // World
    this._oWorld = oWorld;

    // Cotton.Model.HistoryItem contains all data.
    this._oHistoryItem = oHistoryItem;

    // Container for all items
    this._$storyContainer = $storyContainer;

    // current element.
    this._$item = $('<div class="ct-story_item"></div>');

    // current sub elements.
    this._oItemContent = new Cotton.UI.Story.Item.Content.Factory(this);

    // create item
    if (this.itemType() !== 'search'){
      this._$item.append(this._oItemContent.$());
      this._$storyContainer.isotope( 'insert', this._$item);
    }

    //boolean to know if a reload has been performed
    this._bReload = false;
  },

  $ : function() {
    return this._$item;
  },

  world : function(){
    return this._oWorld;
  },

  historyItem : function() {
    return this._oHistoryItem;
  },

  itemType : function() {
    return this._sItemType;
  },

  setItemType : function(sType) {
    this._sItemType = sType;
  },

  container : function() {
    return this._$storyContainer;
  },

  reload : function() {
    self = this;

    // FIXME(rmoutard): do not use the database in item.
    var oDatabase = this._oWorld.lightyear().database();
    oDatabase.find('historyItems', 'id', self.historyItem().id(),
      function(oHistoryItem) {
        self._$item.empty();
        self._oHistoryItem = oHistoryItem;
        self._bReload = true;
        self._oItemContent = new Cotton.UI.Story.Item.Content.Factory(self);
    });
  },

  isReloaded : function() {
    return this._bReload;
  },

  setReloaded : function(bReload) {
    this._bReload = bReload;
  }

});
