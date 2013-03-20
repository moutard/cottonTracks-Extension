'use strict';

/**
 * In charge of displaying an item frame + content.
 */
Cotton.UI.Story.Element = Class.extend({

  // parent element.
  _oWorld : null,

  /**
   * {Cotton.Model.Story} _oStory
   */
  _oStory : null,

  /**
   * {Array.<Cotton.UI.Story.Item.Element>}
   */
  _lItems : [],

  // current element.
  _$story : null,
  _$itemsContainer : null,

  init : function(oStory, oWorld) {
    this._oWorld = oWorld;

    this._oStory = oStory;
    this._lItems = [];

    this._$story = $('<div class="ct-story"></div>');
    this._$itemsContainer = $('<div class="ct-items_container"></div>');

    // Fill the story with the historyItems.
    var lDOMItems = [];
    var lHistoryItems = oStory.historyItems();
    for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      var oItem = new Cotton.UI.Story.Item.Element(oHistoryItem, this);
      this._lItems.push(oItem);
      // create a temp array that will be passed as jQuery.
      // jQuery use documentFragment to append array to the DOM making this
      // operation faster to avoid the reflow.
      lDOMItems.push(oItem.$());
    }

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
    var oItemElement = new Cotton.UI.Story.Item.Element(oHistoryItem);
    this._$itemsContainer.append(oItemElement);
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

});


