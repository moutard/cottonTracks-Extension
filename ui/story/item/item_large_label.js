'use strict';

/**
 * Item_Large_Label Contains title and source for maps / videos
 */
Cotton.UI.Story.Item.LargeLabel = Class.extend({

  _oItemContent : null,

  _$itemLargeLabel : null,
  _oItemTitle : null,
  _oItemWebsite : null,

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    // current item.
    this._$itemLargeLabel = $('<div class="ct-label-large"></div>');

    // current sub elements
    this._oItemTitle = new Cotton.UI.Story.Item.Title(this._oItemContent);
    this._oItemWebsite = new Cotton.UI.Story.Item.Website(this._oItemContent);

    // construct item
    self._$itemLargeLabel.append(
      self._oItemTitle.$(),
      self._oItemWebsite.$()
    );

  },

  $ : function() {
    return this._$itemLargeLabel;
  }

});
