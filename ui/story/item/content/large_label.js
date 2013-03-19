'use strict';

/**
 * Large_Label Contains title and source for maps / videos
 */
Cotton.UI.Story.Item.Content.LargeLabel = Class.extend({

  // parent element.
  _oItemContent : null,

  _sUrl : null,

  // current element.
  _$large_label : null,

  // sub elements.
  _oTitle : null,
  _oWebsite : null,

  init : function(sTitle, sUrl, oItemContent) {

    // current parent element.
    this._oItemContent = oItemContent;

    // current item.
    this._$large_label = $('<div class="ct-large_label"></div>');

    // current sub elements
    this._oTitle = new Cotton.UI.Story.Item.Content.Title(sTitle, this._oItemContent);
    this._oWebsite = new Cotton.UI.Story.Item.Content.Website(sUrl, this._oItemContent);

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
