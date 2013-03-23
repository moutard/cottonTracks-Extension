'use strict';

/**
 * Toolbox Large is the action menu for videos and maps items
 * Contains open and remove buttons
 */
Cotton.UI.Story.Item.Toolbox.Simple = Class.extend({

  _oItem : null,

  _$toolbox : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,

  init : function(sUrl, oDispacher, oContent) {

    // current parent element.
    this._oContent = oContent;

    this._oDispacher = oDispacher;

    // current item
    this._$toolbox = $('<div class="ct-toolbox"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openingLink = $('<a href="' + sUrl + '" target="blank"></a>');
    this._$open = $('<p>Open</p>');

    // construct item
    this._$toolbox.append(
      this._$openingLink.append(this._$open),
      this._$remove
    );

  },

  $ : function() {
    return this._$toolbox;
  }

});
