'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Item.Element = Class.extend({

  // parent element.
  _oStory : null,

  _oHistoryItem : null,
  _sItemType : null,
  _oContent : null,
  _bReload : null,

  // current element.
  _$item : null,

  init : function(oHistoryItem, oDispacher, oStoryElement) {
    var self = this;

    // Cotton.Model.HistoryItem contains all data.
    this._oHistoryItem = oHistoryItem;
    this._oDispacher = oDispacher;
    this._oStoryElement = oStoryElement;
    // current element.
    this._$item = $('<div class="ct-story_item"></div>');

    // current sub elements.
    this._oContent = new Cotton.UI.Story.Item.Content.Factory(oHistoryItem,
      oDispacher, this);
    this._oReader = new Cotton.UI.Story.Item.Content.Brick.Dna.Reader(
      oHistoryItem.extractedDNA(), this);

    this._$item.append(
      this._oContent.$(),
      this._oReader.$()
    ).addClass(this.type());

    //boolean to know if a reload has been performed
    this._bReload = false;
  },

  $ : function() {
    return this._$item;
  },

  story : function() {
    return this._oStoryElement;
  },

  historyItem : function() {
    return this._oHistoryItem;
  },

  type : function() {
    return this._oContent.type();
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
