'use strict';

/**
 * Toolbox Small is the action menu for items with a small label
 * Contains remove, open buttons
 * Contains getContent/expand if item_type is default
 */
Cotton.UI.Story.Item.Toolbox.Complexe = Cotton.UI.Story.Item.Toolbox.Simple
  .extend({

    _bGettingContent : null,

    _$expand : null,
    _$collapse : null,
    _$loading : null,
    _$getContent : null,
    _bHasJustGottenContent : false,

    init : function(bHasExpand, sUrl, oDispacher, oContent) {
      var self = this;

      this._super(sUrl, oDispatcher, oItem, sSize);

      // current item
      this._$toolbox.addClass('small');

      this._$expand = $('<p class="expand">Expand</p>').hide();
      this._$collapse = $('<p class="collapse">Collapse</p>').hide();
      this._$getContent = $('<p class="get_content">Get Content</p>').hide();
      this._$loading = $('<img class="loading" src="/media/images/story/item/default_item/loading.gif">').hide();

      // If there is no paragraph you can expand display the getContent button.
      this._bHasJustGottenContent = false;
      var bHasGetContent = !bHasExpand && !this._bHasJustGottenContent;
      if (bHasGetContent) {
        this._$getContent.show();
      } else if (bHasExpand) {
        this._$expand.show();
      }

      //set actions on buttons
      //remove element

      //expand reader
      this._$expand.click(function(){
        // FIXME(rmoutard) : we can avoid that with local dispatcher or id.
        self._oItem.$().addClass('expanded');
        self._$toolbox.addClass("visible");
        $(this).hide();
        self._$collapse.show();
        self._oDispatcher.publish('item:expand');
      });

      //collapse reader
      this._$collapse.click(function(){
        self._oItem.$().removeClass('expanded');
        self._$toolbox.removeClass("visible");
        $(this).hide();
        self._$expand.show();
        self._oDispatcher.publish('item:expand');
      });

      //get content

      // construct item
      this._$toolbox.append(
        this._$expand,
        this._$collapse,
        this._$getContent
      );

    },

    $ : function() {
      return this._$toolbox;
    }

});
