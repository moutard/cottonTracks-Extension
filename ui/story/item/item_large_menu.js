'use strict';

/**
 * Item Large Menu is the action menu for videos and maps items
 * Contains open and remove buttons
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
    this._$openingLink = $('<a href="" target="blank"></a>');
    this._$open = $('<p>Open</p>');

    // set values
    // url
    var sUrl = this._oItemContent.item().historyItem().url();
    self._$openingLink.attr('href',sUrl);

    //remove element
    this._$remove.click(function(){
      //TODO(rkorach): use only one db for the whole UI
      self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
          'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
      }, function() {
        self._oDatabase.delete('historyItems',
          self._oItemContent.item().historyItem().id(),
          function() {
            self._oItemContent.item().container().isotope('remove',
              self._oItemContent.item().$(), function() {
                Cotton.UI.WORLD.countItems();
            });
        });
      });
    });

    // construct item
    self._$itemLargeMenu.append(
      self._$openingLink.append(self._$open),
      self._$remove
    );

  },

  $ : function() {
    return this._$itemLargeMenu;
  }

});
