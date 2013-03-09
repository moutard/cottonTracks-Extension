'use strict';

/**
 * Item Large Menu is the action menu for videos and maps items
 * Contains open and remove buttons
 */
Cotton.UI.Story.Item.LargeMenu = Class.extend({

  _oItemContent : null,

  _$itemLargeMenu : null,

<<<<<<< HEAD
  _$remove : null,
  _$openLink : null,
  _$open : null,
=======
      _$remove : null,
      _$openingLink : null,
      _$open : null,
>>>>>>> 7d6627e... Refactor: clean code in UI

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

   // current item
    this._$itemLargeMenu = $('<div class="ct-label-large-menu"></div>');

<<<<<<< HEAD
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
=======
        // current sub elements
        this._$remove = $('<p>Remove</p>');
        this._$openingLink = $('<a href="" target="blank"></a>');
        this._$open = $('<p>Open</p>');

        // set values
        // url
        var sUrl = this._oItemContent.item().visitItem().url();
        self._$openingLink.attr('href',sUrl);

        //remove element
        this._$remove.click(function(){
          //TODO(rkorach): use only one db for the whole UI
          self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
              'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            self._oDatabase.delete('visitItems',
                self._oItemContent.item().visitItem().id(),
                function() {
        	  self._oItemContent.item().container()
                      .isotope('remove',self._oItemContent.item().$());
            });
          });
        });

        // construct item
        self._$itemLargeMenu.append(
          self._$openingLink.append(self._$open),
          self._$remove
        );

      },
>>>>>>> 7d6627e... Refactor: clean code in UI

  appendTo : function(oItemContent) {
    oItemContent.$().append(this._$itemLargeMenu);
  }

<<<<<<< HEAD
});
=======
    });
>>>>>>> 7d6627e... Refactor: clean code in UI
