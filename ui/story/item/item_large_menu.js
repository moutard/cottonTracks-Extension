'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.LargeMenu = Class.extend({

  _oItemContent : null,

  _$itemLargeMenu : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

   // current item
    this._$itemLargeMenu = $('<div class="ct-label-large-menu"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openLink = $('<a href="" target="blank"></a>');
    this._$open = $('<p>Open</p>');

    // set values
    // url
    var sUrl = this._oItemContent.item().visitItem().url();
    self._$openLink.attr('href',sUrl);

    // construct item
    self._$itemLargeMenu.append(
        self._$remove,
        self._$openLink.append(self._$open)
    );
  },

  $ : function() {
    return this._$itemLargeMenu;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemLargeMenu);
  }

});
