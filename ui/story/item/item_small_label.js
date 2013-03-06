'use strict';

/**
 * Item Small Label is for all items except maps/videos
 * contains the website indications
 */
Cotton.UI.Story.Item.SmallLabel = Class.extend({

  _oItemContent : null,

  _$itemSmallLabel : null,
  _oItemWebsite : null,


  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    this._$itemSmallLabel = $('<div class="ct-label-small"></div>');
    this._oItemWebsite = new Cotton.UI.Story.Item.Website(this._oItemContent);

    // construct item
    this._$itemSmallLabel.append(this._oItemWebsite.$());

  },

  $ : function() {
    return this._$itemSmallLabel;
  },

  appendTo : function($parent) {
    $parent.append(this._$itemSmallLabel);
  },

});
