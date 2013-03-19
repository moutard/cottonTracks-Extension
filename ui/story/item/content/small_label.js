'use strict';

/**
 * Item Small Label is at the bottom of all items except maps/videos
 * contains the website indications.
 */
Cotton.UI.Story.Item.Content.SmallLabel = Class.extend({

  // parent element.
  _oItemContent : null,

  // current element.
  _$small_label : null,

  /**
   * {Cotton.UI.Story.Item.Content.Website}
   */
  _oWebsite : null,

  init : function(sUrl, oItemContent) {

    // parent element.
    this._oItemContent = oItemContent;

    // current element.
    this._$small_label = $('<div class="ct-small_label"></div>');

    // sub elements.
    this._oWebsite = new Cotton.UI.Story.Item.Content.Website(sUrl, this._oItemContent);

    // construct item.
    this._$small_label.append(this._oWebsite.$());

  },

  $ : function() {
    return this._$small_label;
  }

});
