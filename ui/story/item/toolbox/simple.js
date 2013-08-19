'use strict';

/**
 * Toolbox Large is the action menu for videos and maps items
 * Contains open and remove buttons
 */
Cotton.UI.Story.Item.Toolbox.Simple = Class.extend({

  _oItem : null,
  _oDispatcher : null,

  _$toolbox : null,

  _$remove : null,
  _$openLink : null,
  _$open : null,

  init : function(sUrl, oDispatcher, oItem, sSize) {

    // current parent element.
    this._oItem = oItem;

    this._oDispatcher = oDispatcher;

    this._oDispatcher = oDispatcher;

    // current item
    this._$toolbox = $('<div class="ct-toolbox ' + sSize + '"></div>');

    // current sub elements
    this._$remove = $('<p>Remove</p>');
    this._$openingLink = $('<a href="' + sUrl + '" target="_blank"></a>');
    this._$open = $('<p>Open</p>');

    this._$remove.click(function(){
      oDispatcher.publish('item:delete', {
        'id': oItem.historyItem().id(),
        'type': oItem.type()
      });
      Cotton.ANALYTICS.deleteItem(oItem.type());
    });

    this._$open.click(function(){
      Cotton.ANALYTICS.openItem(oItem.type(), 'toolbox');
    });

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
