'use strict';

/**
 * Item Dna
 * NOT USED YET.
 */
Cotton.UI.Story.Item.Dna = Class.extend({

  _oItemContent : null,

  _$item_dna : null,

  init : function(oItemContent) {
    // current parent element.
    this._oItemContent = oItemContent;

    // current item.
    this._$item_dna = $('<div class="ct-item_dna"></div>');

  },

  $ : function(){
    return this._$item_dna;
  },

  appendTo : function(oStoryLine) {
    this._oItemContent.$().append(this._$item_dna);
  },

});

