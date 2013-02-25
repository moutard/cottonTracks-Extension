'use strict';

/**
 * Item Description Contains title and first paragraph
 */
Cotton.UI.Story.Item.SmallMenu = Class.extend({

  _oItemContent : null,

  _$itemMenu : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,
  _$expand : null,

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

   // current item
    this._$itemMenu = $('<div class="ct-label-small-menu"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openLink = $('<a href="" target="blank"></a>');
    this._$open = $('<p>Open</p>');
    this._$expand = $('<p>Expand</p>');

    // url
    var sUrl = this._oItemContent.item().visitItem().url();
    self._$openLink.attr('href',sUrl);

    // construct item
    self._$itemMenu.append(
        self._$remove,
        self._$openLink.append(self._$open),
        self._$expand
    );
  },

  $ : function() {
    return this._$itemMenu;
  },

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemMenu);
  },

});
