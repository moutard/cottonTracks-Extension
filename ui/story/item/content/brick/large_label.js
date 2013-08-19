'use strict';

/**
 * Large_Label Contains title and source for maps / videos
 */
Cotton.UI.Story.Item.Content.Brick.LargeLabel = Class.extend({

  // parent element.
  _oItem : null,

  _sUrl : null,

  // current element.
  _$large_label : null,

  // sub elements.
  _oTitle : null,
  _oWebsite : null,

  init : function(sTitle, sUrl, oItem) {

    // current parent element.
    this._oItem = oItem;

    // current item.
    this._$large_label = $('<div class="ct-label large_label"></div>');

    // current sub elements
    this._oTitle = new Cotton.UI.Story.Item.Content.Brick.Title(sTitle, this._oItem);
    this._oWebsite = new Cotton.UI.Story.Item.Content.Brick.Website(sUrl);

    // construct item
    this._$large_label.append(
      this._oTitle.$(),
      this._oWebsite.$()
    );

  },

  $ : function() {
    return this._$large_label;
  }

});
