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

    init : function(bHasExpand, bIsReloaded, sUrl, oItem) {
      var self = this;

      this._super(sUrl, oItem);

      // current item
      this._$toolbox.addClass('small');

      // If there is paragraph you can expand.
      this._$expand = (bHasExpand) ? $('<p class="expand">Expand</p>') : $('');
      this._$collapse = $('<p class="collapse">Collapse</p>');
      this._$loading = $('<img class="loading" src="/media/images/story/item/default_item/loading.gif">');

      // Do not append 'Get Content' if it has already been performed or
      // if there is a paragraph
      this._$getContent = $('');
      if (!bHasExpand && !bIsReloaded) {
        this._$getContent = $('<p class="get_content">Get Content</p>');
      }

      //set actions on buttons
      //remove element

      //expand reader
      this._$expand.click(function(){
        //oItem.addClass('expanded');
        self.$().addClass("visible_action_menu");
        //oItem.container().isotope('reLayout');
        $(this).hide();
        self._$collapse.show();
      });

      //collapse reader
      this._$collapse.click(function(){
        //oItem.$().removeClass('expanded');
        //oItem.container().isotope('reLayout');
        self.$().removeClass("visible_action_menu");
        $(this).hide();
        self._$expand.show();
      });

      //get content

      // construct item
      this._$toolbox.append(
        this._$expand,
        this._$collapse,
        this._$getContent
      );

      // if the item is constructed from a reload (i.e getContent), expand it.
      if (bIsReloaded) {
        this._$expand.click();
      }

    },

    $ : function() {
      return this._$toolbox;
    }

});
